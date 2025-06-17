import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    email: localStorage.getItem('email') || null,
  }),
  actions: {
    async login(email, password) {
      const res = await axios.post(`${API_URL}/login`, { email, password })
      this.token = res.data.accessToken
      this.refreshToken = res.data.refreshToken 
      this.email = res.data.email

      localStorage.setItem('accessToken', this.token)
      localStorage.setItem('refreshToken', this.refreshToken)
      localStorage.setItem('email', this.email)

      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
    async register(email, password) {
      await axios.post(`${API_URL}/register`, { email, password })
    },
    logout() {
      this.token = null
      this.refreshToken = null
      this.email = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('email')

      delete axios.defaults.headers.common['Authorization']
    },

    async refreshTokenAction() {
      try {
        const res = await axios.post(`${API_URL}/refresh-token`, {
          token: this.refreshToken,
        })
        this.token = res.data.accessToken
        this.refreshToken = res.data.refreshToken

        localStorage.setItem('accessToken', this.token)
        localStorage.setItem('refreshToken', this.refreshToken)

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } catch (error) {
        this.logout()
        throw error
      }
    }
  }
})

axios.interceptors.response.use(
  response => response,
  async error => {
    const auth = useAuthStore()
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await auth.refreshTokenAction()
        originalRequest.headers['Authorization'] = `Bearer ${auth.token}`
        return axios(originalRequest)
      } catch (err) {
        auth.logout()
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)
