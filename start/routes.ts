/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import transmit from '@adonisjs/transmit/services/main'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const NotificationsController = () => import('#controllers/notification_controller')

transmit.registerRoutes((route) => {
  route.use(middleware.auth())
})

router.on('/').renderInertia('home')

router
  .group(() => {
    router.get('notifications', [NotificationsController, 'index'])
    router.post('notifications', [NotificationsController, 'store'])
    router.get('notifications/unread/count', [NotificationsController, 'unreadCount'])
    router.post('notifications/:id/read', [NotificationsController, 'markAsRead'])
    router.post('notifications/read-all', [NotificationsController, 'markAllAsRead'])
  })
  .use(middleware.auth())
