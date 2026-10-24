<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useArticleStore } from '../stores/article'
import AppCard from '../components/AppCard.vue'
import { statusMap } from '../types/Article'

const route = useRoute()
const articleId = Number(route.params.id)

const store = useArticleStore()

// 从文章列表中根据 ID 查找文章，computed让"查找结果"能自动跟着数据变化，不用计算属性包裹的话只会执行一次且页面刚打开时是空的
const article = computed(() => store.articles.find((a) => a.id === articleId))
</script>

<template>
  <h1>文章详情页</h1>
  <AppCard v-if="article" :title="article.title">
    <template #action>
      <RouterLink to="/">返回列表</RouterLink>
    </template>
    <p>作者：{{ article.author.name }}</p>
    <p>状态：{{ statusMap[article.status] }}</p>
    <p>标签：</p>
    <ul>
      <li v-for="tag in article.tags" :key="tag">{{ tag }}</li>
    </ul>
  </AppCard>
  <p v-else>没有找到 ID 为 {{ route.params.id }} 的文章</p>
</template>
