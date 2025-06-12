<template>
  <div>
    <h1>Register</h1>
    <RegisterForm />
    <p>มีบัญชีแล้ว? <router-link to="/login">เข้าสู่ระบบที่นี่</router-link></p>
  </div>
</template>

<script setup>
import RegisterForm from '../components/RegisterForm.vue'
</script>
