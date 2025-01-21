import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import NotificationService from '#services/notification_service'
import { NotificationValidator } from '#validators/notification'

@inject()
export default class NotificationsController {
  constructor(protected notificationService: NotificationService) {}

  async index({ auth, request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 15)

    const notifications = await this.notificationService.getNotifications(
      auth.user!.id,
      page,
      limit
    )

    return inertia.render('notifications/index', {
      notifications: notifications,
    })
  }

  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(NotificationValidator)
    await this.notificationService.create({
      ...payload,
      userId: auth.user!.id,
    })

    return response.redirect().back()
  }

  async unreadCount({ inertia, auth }: HttpContext) {
    const count = await this.notificationService.getUnreadCount(auth.user!.id)

    return inertia.render('notifications/unread', {
      count,
    })
  }

  async markAsRead({ auth, params, response }: HttpContext) {
    await this.notificationService.markAsRead(params.id, auth.user!.id)
    return response.redirect().back()
  }

  async markAllAsRead({ auth, response }: HttpContext) {
    await this.notificationService.markAllAsRead(auth.user!.id)
    return response.redirect().back()
  }
}
