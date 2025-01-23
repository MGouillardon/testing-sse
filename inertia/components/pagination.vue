<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  lastPage: number
}>()

const pages = computed(() => {
  return Array.from({ length: props.lastPage }, (_, i) => i + 1)
})
</script>

<template>
  <div class="flex gap-2 justify-center mt-4" v-show="pages.length > 1">
    <Link
      v-for="page in pages"
      :key="page"
      :href="`?page=${page}`"
      :class="[
        'px-4 py-2 text-sm border rounded',
        page === currentPage
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
      ]"
      preserve-scroll
    >
      {{ page }}
    </Link>
  </div>
</template>
