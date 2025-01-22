import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import NotificationService from '#services/notification_service'
import Post from '#models/post'

@inject()
export default class PostsController {
  constructor(protected notificationService: NotificationService) {}

  async create({ inertia }: HttpContext) {
    return inertia.render('posts/create')
  }

  async store({ auth, request, response }: HttpContext) {
    await Post.create({
      content: request.input('content'),
      userId: auth.user!.id,
    })

    await this.notificationService.create({
      type: 'new_post',
      content: `New post from ${auth.user!.fullName || 'Anonymous'}`,
      userId: auth.user!.id,
      triggeredById: auth.user!.id,
    })

    return response.redirect().back()
  }
}
