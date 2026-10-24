<script lang="ts" setup>
const emit = defineEmits<{
  publish: []
  draft: []
}>()
</script>

<template>
  <button @click="emit('draft')">修改草稿</button>
  <button @click="emit('publish')">发布文章</button>
</template>
