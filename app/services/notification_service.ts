import Notification from '#models/notification'
import transmit from '@adonisjs/transmit/services/main'
import { NotificationData, SerializedNotification } from '#types/notification'
import { Exception } from '@adonisjs/core/exceptions'

export default class NotificationService {
  private serializeNotification(notification: Notification): SerializedNotification {
    return {
      id: notification.id,
      type: notification.type,
      content: notification.content,
      read: notification.read,
      createdAt: notification.createdAt.toISO(),
      triggeredBy: {
        id: notification.triggeredBy.id,
        fullName: notification.triggeredBy.fullName,
      },
    }
  }

  public async create(data: NotificationData) {
    try {
      const notification = await Notification.create(data)
      await notification.load('triggeredBy')

      const serializedNotification = this.serializeNotification(notification)

      transmit.broadcast(`notifications/${data.userId}`, {
        type: 'new_notification',
        notification: serializedNotification,
      })

      return notification
    } catch (error) {
      throw new Exception('Failed to create notification', { status: 500 })
    }
  }

  public async createMany(notifications: NotificationData[]) {
    return Promise.all(notifications.map((data) => this.create(data)))
  }

  public async markAsRead(notificationId: number, userId: number) {
    try {
      const notification = await Notification.query()
        .where('id', notificationId)
        .where('user_id', userId)
        .firstOrFail()

      notification.read = true
      await notification.save()

      transmit.broadcast(`notifications/${userId}`, {
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

      transmit.broadcast(`notifications/${userId}`, {
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
        ...notifications.toJSON(),
        data: notifications.all().map((n) => this.serializeNotification(n)),
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
