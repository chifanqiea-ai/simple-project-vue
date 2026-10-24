<script setup lang="ts">
import ArticleCard from './ArticleCard.vue'
import { type Article } from '../types/Article.ts'

// 纯展示组件：数据由父组件传进来（props），自己不再去 store 拿。
// 谁给数据谁负责算好，组件只负责"摆出来"。
// 编辑/删除事件也原样向上转交，由页面决定怎么处理（弹窗在哪开、确认框在哪弹）
defineProps<{ articles: Article[] }>()
const emit = defineEmits<{
  edit: [article: Article]
  remove: [article: Article]
}>()
</script>

<template>
  <ArticleCard
    v-for="item in articles"
    :key="item.id"
    :article="item"
    @edit="emit('edit', item)"
    @remove="emit('remove', item)"
  />
</template>
