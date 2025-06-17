<template>
    <div>
        <h1>Welcome to Home</h1>
        <button @click="logout">Logout</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'  

const router = useRouter()
const auth = useAuthStore()  

function logout() {
    auth.logout()
    router.push('/login')
}
</script>

<style scoped>
button {
    margin-top: 16px;
    padding: 8px 16px;
    cursor: pointer;
}
</style>
