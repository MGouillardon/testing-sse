<script setup lang="ts">
import { computed } from 'vue'
import type { SerializedNotification } from '#types/notification'

interface Props {
  notification: SerializedNotification
}

const props = defineProps<Props>()

const readClass = computed(() => 
  props.notification.read ? 'bg-gray-50' : 'bg-white'
)
</script>

<template>
  <div :class="['p-4 border rounded', readClass]">
    <div class="text-sm">{{ notification.content }}</div>
    <div class="text-xs text-gray-500 mt-1">
      {{ new Date(notification.createdAt).toLocaleDateString() }}
    </div>
  </div>
</template>