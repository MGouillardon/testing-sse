<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Link } from '@inertiajs/vue3'

const isOpen = ref(false)
const unreadCount = ref(0)

onMounted(async () => {
  const response = await fetch('/notifications/unread')
  const data = await response.json()
  unreadCount.value = data.count
})
</script>

<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" class="p-2">
      <i class="fas fa-bell"></i>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5"
      >
        {{ unreadCount }}
      </span>
    </button>

    <div v-if="isOpen" class="absolute right-0 w-80 mt-2 bg-white rounded-lg shadow-lg">
      <div class="p-4 border-b">
        <Link href="/notifications">Notifications</Link>
      </div>
    </div>
  </div>
</template>
