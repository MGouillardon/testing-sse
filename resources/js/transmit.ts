import { Transmit } from '@adonisjs/transmit-client'

class NotificationTransmit {
  private transmit: Transmit
  private subscription: any = null

  constructor() {
    this.transmit = new Transmit({
      baseUrl: window.location.origin,
      beforeSubscribe: (channel, request) => {},
    })
  }

  async subscribeToNotifications(userId: number) {
    if (this.subscription) {
      await this.subscription.delete()
    }

    this.subscription = this.transmit.subscription(`notifications/${userId}`)
    await this.subscription.create()

    return this.subscription
  }

  async unsubscribe() {
    if (this.subscription) {
      await this.subscription.delete()
      this.subscription = null
    }
  }
}

export const notificationTransmit = new NotificationTransmit()
