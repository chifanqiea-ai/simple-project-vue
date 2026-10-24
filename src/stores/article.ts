import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type ArticleFilter, type RequestState, type ArticleData } from '../types/Article'
import { requestArticleList } from '../api/article'

export const useArticleStore = defineStore('article', () => {
  // ===== state：相当于 Bean 的字段 =====
  const state = ref<RequestState<ArticleData>>({
    status: 'loading',
  })

  const articles = computed(() => (state.value.status === 'success' ? state.value.data.list : []))

  const statusFilter = ref<ArticleFilter>('all')
  // ===== getters：相当于 Bean 的派生属性 =====
  const filteredArticles = computed(() => {
    return statusFilter.value === 'all'
      ? articles.value
      : articles.value.filter((a) => a.status === statusFilter.value)
  })

  function listByStatus(status: ArticleFilter) {
    statusFilter.value = status
  }

  // ===== actions：相当于 Bean 的业务方法。所有写操作都走这里 =====
  function publish(id: number) {
    const article = articles.value.find((a) => a.id === id)
    if (article) {
      article.status = 'published'
    }
  }

  function draft(id: number) {
    const article = articles.value.find((a) => a.id === id)
    if (article) {
      article.status = 'draft'
    }
  }

  async function loadArticles() {
    state.value = { status: 'loading' }

    const res = await requestArticleList()
    if (res.code === 0) {
      state.value = { status: 'success', data: res.data }
    } else {
      state.value = { status: 'error', error: new Error(res.msg) }
    }
  }

  return {
    state,
    articles,
    filteredArticles,
    statusFilter,
    listByStatus,
    publish,
    draft,
    loadArticles,
  }
})
