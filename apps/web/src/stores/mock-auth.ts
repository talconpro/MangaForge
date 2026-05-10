import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authMock } from '@/mock/api'

export const useMockAuthStore = defineStore('mock-auth', () => {
  const token = ref('')
  const user = ref<{ id: string; username: string } | null>(null)

  async function login(account: string, password: string) {
    const result = await authMock.login(account, password)
    token.value = result.token
    user.value = result.user
    return result
  }

  function logout() {
    token.value = ''
    user.value = null
  }

  return { token, user, login, logout }
})
