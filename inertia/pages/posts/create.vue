<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  content: '',
})

const submit = () => {
  form.post('/posts')
}
</script>

<template>
  <form @submit.prevent="submit">
    <textarea
      v-model="form.content"
      placeholder="What's on your mind?"
      class="w-full p-2 border rounded"
    ></textarea>
    <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Post</button>
  </form>
</template>
