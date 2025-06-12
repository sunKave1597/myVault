<template>
  <div>
    <h1>Login</h1>
    <LoginForm @login-success="onLoginSuccess" />
    <p>ยังไม่มีบัญชี? <router-link to="/register">สมัครสมาชิกที่นี่</router-link></p>
  </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue'

function onLoginSuccess() {
  alert('Login สำเร็จ! เดี๋ยวพาไปหน้า Vault')
  // จะทำ redirect ต่อได้ที่นี่ เช่น router.push('/vault')
}
</script>
