import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    email: null
  }),
  actions: {
    async login(email, password) {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password })
      this.token = res.data.token
      this.email = res.data.email
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
    async register(email, password) {
      await axios.post('http://localhost:3000/api/auth/register', { email, password })
    },
    logout() {
      this.token = null
      this.email = null
      delete axios.defaults.headers.common['Authorization']
    }
  }
})
