<script lang="ts" setup>
const emit = defineEmits<{
  publish: []
  draft: []
  edit: []
  remove: []
}>()
</script>

<template>
  <button @click="emit('draft')">修改草稿</button>
  <button @click="emit('publish')">发布文章</button>
  <button @click="emit('edit')">编辑</button>
  <button @click="emit('remove')">删除</button>
</template>
