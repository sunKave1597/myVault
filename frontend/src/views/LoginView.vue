<template>
  <div>
    <h1>Login</h1>
    <LoginForm @login-success="onLoginSuccess" />
    <p>ยังไม่มีบัญชี? <router-link to="/register">สมัครสมาชิกที่นี่</router-link></p>
  </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function onLoginSuccess() {
  alert('Login สำเร็จ!')
  router.push('/home')  
}
</script>

