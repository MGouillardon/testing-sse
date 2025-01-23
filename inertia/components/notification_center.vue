<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Transmit } from '@adonisjs/transmit-client'
import { SerializedNotification, NotificationEvent } from '#types/notification'
import Notification from './notification.vue'
import { router, usePage } from '@inertiajs/vue3'

const page = usePage()
const isOpen = ref(false)
const notifications = ref<SerializedNotification[]>([])
const unreadCount = ref(0)
const transmit = new Transmit({
  baseUrl: window.location.origin,
})

const handleNewNotification = (event: NotificationEvent) => {
  if (event.type === 'new_notification' && event.notification) {
    notifications.value.unshift(event.notification)
    unreadCount.value++
  } else if (event.type === 'notification_read') {
    const notification = notifications.value.find((n) => n.id === event.notificationId)
    if (notification) {
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  } else if (event.type === 'all_notifications_read') {
    notifications.value.forEach((n) => (n.read = true))
    unreadCount.value = 0
  }
}

const markAllAsRead = () => {
  router.post('/notifications/read-all')
}

onMounted(async () => {
  const auth = page.props.auth as { user: { id: string } }
  if (!auth.user) return

  const response = await fetch('/notifications?limit=10')
  const { data } = await response.json()
  notifications.value = data

  unreadCount.value = notifications.value.filter((n) => !n.read).length

  const subscription = transmit.subscription(`notifications/${(page.props.auth as { user: { id: string } }).user.id}`)
  subscription.onMessage((data: NotificationEvent) => {
    handleNewNotification(data)
  })
  await subscription.create()
})

onUnmounted(() => {
  transmit.close()
})
</script>
<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" class="relative p-2 text-gray-600 hover:text-gray-800">
      <span class="sr-only">Notifications</span>
      <i class="fas fa-bell text-xl"></i>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ unreadCount }}
      </span>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div class="p-4 border-b">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Notifications</h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-sm text-blue-500 hover:text-blue-700"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <template v-if="notifications.length">
          <Notification
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
          />
        </template>
        <div v-else class="p-4 text-center text-gray-500">No notifications</div>
      </div>
    </div>
  </div>
</template>
