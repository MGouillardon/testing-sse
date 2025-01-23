<script setup>
import NotificationCenter from '../components/notification_center.vue'
</script>
<template>
  <div>
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
          </div>
          <div class="flex items-center">
            <NotificationCenter />
          </div>
        </div>
      </div>
    </nav>

    <main>
      <slot></slot>
    </main>
  </div>
</template>
