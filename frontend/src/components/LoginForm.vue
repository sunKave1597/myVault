<template>
  <form @submit.prevent="submitLogin">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Login</button>
    <p v-if="error" style="color:red;">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const email = ref('')
const password = ref('')
const error = ref(null)
const authStore = useAuthStore()

async function submitLogin() {
  error.value = null
  try {
    await authStore.login(email.value, password.value)
    emit('login-success')
  } catch (e) {
    error.value = e.response?.data?.message || 'Login failed'
  }
}
</script>
