export const NOTIFICATION_TYPES = ['new_post', 'mention', 'like'] as const
export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export type NotificationEventType =
  | 'new_notification'
  | 'notification_read'
  | 'all_notifications_read'

export interface NotificationData {
  type: NotificationType
  content: string
  userId: number
  triggeredById: number
}

export interface SerializedNotification {
  id: number
  type: NotificationType
  content: string
  read: boolean
  createdAt: string
  triggeredBy: {
    id: number
    fullName: string | null
  }
}

export interface NotificationEvent {
  type: NotificationEventType
  notification?: SerializedNotification
  notificationId?: number
}
