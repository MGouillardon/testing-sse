import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      email: 'test@example.com',
      password: 'password',
      fullName: 'Test User',
    })
  }
}
