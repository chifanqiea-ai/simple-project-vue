<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useArticleStore } from '../stores/article'
import { storeToRefs } from 'pinia'
import AppCard from '../components/AppCard.vue'
import { statusMap } from '../types/Article'

const route = useRoute()
const articleId = Number(route.params.id)

const store = useArticleStore()
const { detailState } = storeToRefs(store)
const loadArticleDetail = store.loadArticleDetail

// 详情数据单独从后端拉（GET /api/article/{id}），不再从列表里找。
// 好处：直接刷新详情页、或从收藏夹点进来，都能正常显示
const article = computed(() => (detailState.value.status === 'success' ? detailState.value.data : null))
const isLoading = computed(() => detailState.value.status === 'loading')
const errorMsg = computed(() => (detailState.value.status === 'error' ? detailState.value.error.message : ''))

onMounted(() => {
  loadArticleDetail(articleId)
})
</script>

<template>
  <h1>文章详情页</h1>

  <p v-if="isLoading">加载中…</p>

  <p v-else-if="errorMsg" style="color: #c33">
    出错了：{{ errorMsg }}
    <button @click="loadArticleDetail(articleId)">重试</button>
  </p>

  <AppCard v-else-if="article" :title="article.title">
    <template #action>
      <RouterLink to="/">返回列表</RouterLink>
    </template>
    <p>作者：{{ article.author.name }}</p>
    <p>状态：{{ statusMap[article.status] }}</p>
    <p>查看量：{{ article.stats.views }}　点赞量：{{ article.stats.likes }}</p>
    <p>发布时间：{{ article.publishedAt ?? '未发布' }}</p>
    <p>标签：</p>
    <ul>
      <li v-for="tag in article.tags" :key="tag">{{ tag }}</li>
    </ul>
  </AppCard>

  <p v-else>没有找到 ID 为 {{ route.params.id }} 的文章</p>
</template>
