<script setup lang="ts">
import { useLoginStore } from './stores/auth'
import { storeToRefs } from 'pinia'

const loginStore = useLoginStore()
const { isLoggedIn } = storeToRefs(loginStore)
</script>

<template>
  <RouterLink to="/">列表页</RouterLink>
  <p>
    当前登录态：<b>{{ isLoggedIn ? '已登录' : '未登录' }}</b>
  </p>
  <button @click="loginStore.login">登录</button>
  <button @click="loginStore.unLogin">退出登录</button>
  <RouterView />
</template>

