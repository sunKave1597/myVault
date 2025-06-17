<template>
  <form @submit.prevent="submitLogin">
    <div>
      <label for="email">Email:</label>
      <input v-model="email" type="email" id="email" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input v-model="password" type="password" id="password" required />
    </div>
    <button type="submit">Login</button>
  </form>
</template>
<script setup>
import { ref, defineEmits } from 'vue'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')

const auth = useAuthStore()
const emit = defineEmits(['login-success']) 

async function submitLogin() {
  try {
    await auth.login(email.value, password.value)
    emit('login-success')  
  } catch (error) {
    alert('Login ล้มเหลว: ' + (error.response?.data?.message || error.message))
  }
}
</script>

