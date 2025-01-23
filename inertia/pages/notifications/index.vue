<script setup lang="ts">
import { computed } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '~/layouts/app_layout.vue'
import Notification from '~/components/notification.vue'
import Pagination from '~/components/pagination.vue'
import type { SerializedNotification } from '#types/notification'

interface Props {
  notifications: {
    data: SerializedNotification[]
    meta: {
      current_page: number
      last_page: number
    }
  }
}

const props = defineProps<Props>()

const hasUnread = computed(() => {
  return props.notifications.data.some((notification) => !notification.read)
})

const markAllAsRead = () => {
  router.post(
    '/notifications/read-all',
    {},
    {
      preserveScroll: true,
    }
  )
}
</script>
<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold text-gray-900">Notifications</h1>
          <button
            v-if="hasUnread"
            @click="markAllAsRead"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Marquer tout comme lu
          </button>
        </div>

        <div class="space-y-4">
          <template v-if="notifications.data.length">
            <Notification
              v-for="notification in notifications.data"
              :key="notification.id"
              :notification="notification"
            />

            <Pagination
              :current-page="notifications.meta.current_page"
              :last-page="notifications.meta.last_page"
            />
          </template>
          <div v-else class="text-center py-12 text-gray-500">Aucune notification</div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
