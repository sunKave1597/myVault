<template>
  <form @submit.prevent="submitRegister">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required minlength="6" />
    <button type="submit">Register</button>
    <p v-if="message" style="color:green;">{{ message }}</p>
    <p v-if="error" style="color:red;">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const email = ref('')
const password = ref('')
const message = ref(null)
const error = ref(null)
const authStore = useAuthStore()

async function submitRegister() {
  error.value = null
  message.value = null
  try {
    await authStore.register(email.value, password.value)
    message.value = 'Registration successful! Please login.'
    email.value = ''
    password.value = ''
  } catch (e) {
    error.value = e.response?.data?.message || 'Registration failed'
  }
}
</script>
