import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, registerApi, getMeApi } from '@/api/auth'
import type { UserInfo, LoginRequest, RegisterRequest } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('access_token') || '')
  const user = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  function setToken(t: string) {
    token.value = t
    if (t) {
      localStorage.setItem('access_token', t)
    } else {
      localStorage.removeItem('access_token')
    }
  }

  async function login(data: LoginRequest) {
    const res = await loginApi(data)
    const body = res.data
    if (body.code === 0 && body.data) {
      setToken(body.data.access_token)
      user.value = body.data.user
    }
    return body
  }

  async function register(data: RegisterRequest) {
    const res = await registerApi(data)
    const body = res.data
    if (body.code === 0 && body.data) {
      setToken(body.data.access_token)
      user.value = body.data.user
    }
    return body
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await getMeApi()
      const body = res.data
      if (body.code === 0 && body.data) {
        user.value = body.data
      }
    } catch {
      // Token invalid, clear it
      setToken('')
      user.value = null
    }
  }

  function logout() {
    setToken('')
    user.value = null
  }

  return { token, user, isLoggedIn, login, register, fetchMe, logout }
})
