<script setup lang="ts">
import { useToast } from '../utils/toast'

// 全站只挂一个（在 App.vue 里），盯住公共喇叭 message：
// 有内容就显示，showToast 的计时器到点清空后自动消失
const { message } = useToast()
</script>

<template>
  <Transition name="toast">
    <div
      v-if="message"
      style="
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 100;
        background: #333;
        color: #fff;
        padding: 10px 16px;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      "
    >
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
/* 淡入淡出：出现和消失都柔和一点 */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
