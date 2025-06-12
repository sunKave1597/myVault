<template>
  <div>
    <h2>Login</h2>
    <LoginForm @login-success="onLoginSuccess" />

    <h2>Register</h2>
    <RegisterForm />
  </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'

function onLoginSuccess() {
  // TODO: redirect to vault page
  alert('Login successful! (ต่อไปทำหน้า Vault)')
}
</script>
