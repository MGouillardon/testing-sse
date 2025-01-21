import transmit from '@adonisjs/transmit/services/main'
import type { HttpContext } from '@adonisjs/core/http'

transmit.authorize('notifications/:userId', (ctx: HttpContext, { userId }) => {
  return ctx.auth.user?.id === +userId
})
