import { ref } from 'vue'
import { defineStore } from 'pinia'
import { setToken, clearToken } from '../utils/token'

export const useLoginStore = defineStore('loginStore', () => {
  const isLoggedIn = ref(false)

  function login() {
    setToken('fake-jwt-' + Date.now())
    isLoggedIn.value = true
  }

  function unLogin() {
    clearToken()
    isLoggedIn.value = false
  }
  return { isLoggedIn, login, unLogin }
})
