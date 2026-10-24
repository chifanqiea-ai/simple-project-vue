<script setup lang="ts">
import { statusMap, filterStatusMap } from '../types/Article.ts'
import ArticleAction from './ArticleActions.vue'
import type { Article } from '../types/Article.ts'
import { useArticles } from '../composables/useArticles.ts'
const props = defineProps<{
  article: Article
}>()

const { statusFilter, publish, draft } = useArticles()
</script>

<template>
  <div>
    <h1>标题：{{ props.article.title }}</h1>
    <ul>
      标签：
      <li v-for="tag in props.article.tags" :key="tag">{{ tag }}</li>
    </ul>
    <p>ID：{{ props.article.id }}</p>
    <p>作者：{{ props.article.author.name }}</p>
    <p>查看量：{{ props.article.stats.views }}</p>
    <p>点赞量：{{ props.article.stats.likes }}</p>
    <p>发布时间：{{ props.article.publishedAt }}</p>
    <p>状态：{{ statusMap[props.article.status] }}</p>
    <p>当前筛选：{{ filterStatusMap[statusFilter] }}</p>
  </div>
  <RouterLink :to="'/article/' + props.article.id">文章详情页</RouterLink>
  <ArticleAction @publish="publish(props.article.id)" @draft="draft(props.article.id)" />
</template>
