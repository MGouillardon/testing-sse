import Notification from '#models/notification'
import transmit from '@adonisjs/transmit/services/main'
import {
  NotificationData,
  SerializedNotification,
  NotificationEvent,
  NotificationType,
} from '#types/notification'
import { Exception } from '@adonisjs/core/exceptions'

export default class NotificationService {
  private serializeNotification(notification: Notification): SerializedNotification {
    if (!notification.$preloaded.triggeredBy) {
      throw new Error('triggeredBy relation must be preloaded')
    }

    return {
      id: notification.id,
      type: notification.type as NotificationType,
      content: notification.content,
      read: notification.read,
      createdAt: notification.createdAt?.toISO() || '',
      triggeredBy: {
        id: notification.triggeredBy.id,
        fullName: notification.triggeredBy.fullName,
      },
    }
  }

  private broadcast(userId: number, event: NotificationEvent) {
    transmit.broadcast(`notifications/${userId}`, event as unknown as Record<string, any>)
  }

  public async create(data: NotificationData) {
    try {
      const notification = await Notification.create({
        ...data,
        read: false,
      })

      await notification.load('triggeredBy')

      const serializedNotification = this.serializeNotification(notification)

      this.broadcast(data.userId, {
        type: 'new_notification',
        notification: serializedNotification,
      })

      return notification
    } catch (error) {
      console.error('Notification creation error:', error)
      throw new Exception('Failed to create notification', {
        cause: error,
        status: 500,
      })
    }
  }

  public async markAsRead(notificationId: number, userId: number) {
    try {
      const notification = await Notification.query()
        .where('id', notificationId)
        .where('user_id', userId)
        .firstOrFail()

      notification.read = true
      await notification.save()

      this.broadcast(userId, {
        type: 'notification_read',
        notificationId: notification.id,
      })

      return notification
    } catch (error) {
      throw new Exception('Failed to mark notification as read', { status: 500 })
    }
  }

  public async markAllAsRead(userId: number) {
    try {
      await Notification.query()
        .where('user_id', userId)
        .where('read', false)
        .update({ read: true })

      this.broadcast(userId, {
        type: 'all_notifications_read',
      })
    } catch (error) {
      throw new Exception('Failed to mark all notifications as read', { status: 500 })
    }
  }

  public async getNotifications(userId: number, page: number = 1, limit: number = 15) {
    try {
      const notifications = await Notification.query()
        .where('user_id', userId)
        .preload('triggeredBy')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      return {
        data: notifications.all().map((n) => this.serializeNotification(n)),
        meta: {
          currentPage: notifications.currentPage,
          lastPage: notifications.lastPage,
          total: notifications.total,
          links: notifications.getUrlsForRange(),
        },
      }
    } catch (error) {
      throw new Exception('Failed to fetch notifications', { status: 500 })
    }
  }

  public async getUnreadCount(userId: number): Promise<number> {
    return await Notification.query()
      .where('user_id', userId)
      .where('read', false)
      .count('* as total')
      .first()
      .then((result) => Number(result?.$extras.total) || 0)
  }
}
