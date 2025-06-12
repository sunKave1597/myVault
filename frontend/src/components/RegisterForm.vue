<template>
  <form @submit.prevent="submitRegister">
    <div>
      <label for="email">Email:</label>
      <input v-model="email" type="email" id="email" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input v-model="password" type="password" id="password" required />
    </div>
    <button type="submit">Register</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')

const auth = useAuthStore()

async function submitRegister() {
  try {
    await auth.register(email.value, password.value)
    alert('สมัครสมาชิกสำเร็จ! ไป login ได้เลย')
  } catch (error) {
    alert('สมัครสมาชิกล้มเหลว: ' + (error.response?.data?.message || error.message))
  }
}
</script>
