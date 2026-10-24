import { ref } from 'vue'

// ===== 全局气泡提示（替代 alert 的"公共喇叭"）=====
// 为什么不用 alert：alert 是浏览器原生弹窗，弹多了浏览器会"静音"它（禁止对话框），
// 导致闪一下就消失。气泡是页面自己的 HTML，浏览器管不着。
//
// 原理：message 是模块级（整个应用共用一份）的响应式变量，
// showToast 往里喊话 → App.vue 里的气泡组件自动显示 → 计时器到点自动清空。

const message = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

export function useToast() {
  function showToast(msg: string, duration = 2000) {
    message.value = msg
    // 连续喊话时重置计时器，保证最后一次提示完整显示
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      message.value = ''
    }, duration)
  }

  return { message, showToast }
}
