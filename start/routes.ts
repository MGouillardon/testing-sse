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

transmit.registerRoutes((route) => {
  route.use(middleware.auth())
})

router.on('/').renderInertia('home')
