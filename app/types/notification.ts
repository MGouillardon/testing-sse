export type NotificationType = 'new_post' | 'mention' | 'like'

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
