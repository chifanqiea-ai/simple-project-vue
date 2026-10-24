<script setup lang="ts">
import { useArticles } from '../composables/useArticles'
const { listByStatus, countByStatus } = useArticles()
</script>

<template>
  <button @click="listByStatus('all')">显示所有</button>
  <button @click="listByStatus('published')">显示已发布</button>
  <button @click="listByStatus('draft')">显示草稿</button>
  <button @click="listByStatus('archived')">显示已归档</button>
  <p>
    所有文章数：{{ countByStatus.all }}，已发布：{{ countByStatus.published }}，草稿：{{
      countByStatus.draft
    }}，已归档：{{ countByStatus.archived }}
  </p>
</template>
