<script setup lang="ts">
// props 是父组件给的，只许"看"，不许"改"（只读纪律）。
// 用户一输入，就 emit 把新值"上报"给父组件，让父组件去改自己的状态。
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onInput(e: Event) {
  // e 是浏览器给的"输入事件"，真正的文字在 e.target.value 里
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <!-- :value 只是"显示"父组件传来的值；@input 只是"上报"新值。
       真正的修改发生在父组件（v-model 帮我们写好了），
       新值再流回这里显示，形成闭环 -->
  <input :value="props.modelValue" placeholder="搜索" @input="onInput" />
</template>
