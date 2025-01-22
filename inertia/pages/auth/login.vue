<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  email: '',
  password: ''
})

const submit = () => {
  form.post('/login')
}
</script><template>
  <div class="min-h-screen flex items-center justify-center">
    <form @submit.prevent="submit" class="w-full max-w-md p-6 bg-white rounded shadow-md">
      <div class="mb-4">
        <label class="block mb-2">Email</label>
        <input 
          v-model="form.email" 
          type="email"
          class="w-full p-2 border rounded"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-2">Password</label>
        <input 
          v-model="form.password" 
          type="password"
          class="w-full p-2 border rounded"
        />
      </div>

      <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </form>
  </div>
</template>

