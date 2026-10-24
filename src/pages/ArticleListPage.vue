<script setup lang="ts">
import ArticleList from '../components/ArticleList.vue'
import ArticleFormModal from '../components/ArticleFormModal.vue'
import FilterBar from '../components/FilterBar.vue'
import SearchBar from '../components/SearchBar.vue'

import { computed, onMounted, ref } from 'vue'
import type { Article } from '../types/Article'
import { useArticleStore } from '../stores/article'
import { storeToRefs } from 'pinia'

const articleStore = useArticleStore()
// filteredArticles：store 里已经按"状态筛选"算好的列表
const { state, filteredArticles } = storeToRefs(articleStore)
const loadArticles = articleStore.loadArticles

// 三者都能从 state 这一个响应式源算出来 → 派生值，用 computed。
// 写成 ref 就得每次手动重新赋值，漏一次就不同步
const isLoading = computed(() => state.value.status === 'loading')
const errorMsg = computed(() => (state.value.status === 'error' ? state.value.error.message : ''))

// 搜索关键字：只属于这个页面的本地状态，不放 store
const keyword = ref('')

// 派生值实战（P0-4 判据）：两个筛选叠加
// 状态筛选结果 → 再叠关键词筛选。
// keyword 一变，visibleArticles 自动重算，列表自动更新，不用手动刷新
const visibleArticles = computed(() =>
  filteredArticles.value.filter((a) => a.title.includes(keyword.value)),
)

// 新增/编辑弹窗：null=关着；有文章=编辑它；新建用特殊标记区分
const formVisible = ref(false)
const editingArticle = ref<Article | null>(null)

function openCreateForm() {
  editingArticle.value = null
  formVisible.value = true
}

function openEditForm(article: Article) {
  editingArticle.value = article
  formVisible.value = true
}

function closeForm() {
  formVisible.value = false
  editingArticle.value = null
}

function confirmRemove(article: Article) {
  // 浏览器自带确认框：误点了还能反悔
  if (confirm(`确定删除「${article.title}」吗？删除后不可恢复`)) {
    articleStore.removeArticle(article.id)
  }
}

onMounted(() => {
  loadArticles()
})
</script>

<template>
  <SearchBar v-model="keyword" />
  <div style="border: 2px solid #888; padding: 12px; margin-bottom: 12px">
    <p v-if="isLoading">加载中…</p>

    <p v-else-if="errorMsg" style="color: #c33">
      出错了：{{ errorMsg }}
      <button @click="loadArticles">重试</button>
    </p>

    <template v-else>
      <button @click="openCreateForm">新增文章</button>
      <FilterBar />
      <ArticleList :articles="visibleArticles" @edit="openEditForm" @remove="confirmRemove" />
    </template>
  </div>

  <!-- 新增/编辑弹窗：保存成功后关掉（列表已在 store 里刷新） -->
  <ArticleFormModal v-if="formVisible" :article="editingArticle" @close="closeForm" @saved="closeForm" />
</template>
