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
const PostsController = () => import('#controllers/post_controller')
const AuthController = () => import('#controllers/auth_controller')

transmit.registerRoutes((route) => {
  route.use(middleware.auth())
})

router.get('/', async ({ auth, response }) => {
  return auth.user ? response.redirect('/posts/create') : response.redirect('/login')
})
router.get('/login', [AuthController, 'showLogin']).use(middleware.guest())
router.post('/login', [AuthController, 'login']).use(middleware.guest())
router.post('/logout', [AuthController, 'logout']).use(middleware.auth())

router
  .group(() => {
    router.get('notifications', [NotificationsController, 'index'])
    router.post('notifications', [NotificationsController, 'store'])
    router.get('notifications/unread/count', [NotificationsController, 'unreadCount'])
    router.post('notifications/:id/read', [NotificationsController, 'markAsRead'])
    router.post('notifications/read-all', [NotificationsController, 'markAllAsRead'])
  })
  .use(middleware.auth())

router.get('posts/create', [PostsController, 'create']).use(middleware.auth())
router.post('/posts', [PostsController, 'store']).use(middleware.auth())
