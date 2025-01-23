<script setup lang="ts">
import { SerializedNotification } from '#types/notification'
import { router } from '@inertiajs/vue3'

const props = defineProps<{
  notification: SerializedNotification
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const markAsRead = () => {
  router.post(`/notifications/${props.notification.id}/read`)
}
</script><template>
  <div 
    :class="[
      'p-4 mb-2 rounded shadow transition-opacity',
      notification.read ? 'bg-gray-100' : 'bg-white'
    ]"
  >
    <div class="flex justify-between items-start">
      <div>
        <p class="text-sm text-gray-800">{{ notification.content }}</p>
        <span class="text-xs text-gray-500">
          {{ formatDate(notification.createdAt) }}
        </span>
      </div>
      <button 
        v-if="!notification.read"
        @click="markAsRead"
        class="text-sm text-blue-500 hover:text-blue-700"
      >
        Mark as read
      </button>
    </div>
  </div>
</template>

