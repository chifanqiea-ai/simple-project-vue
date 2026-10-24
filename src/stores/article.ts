import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  type ArticleFilter,
  type ArticleStatus,
  type RequestState,
  type ArticleData,
  type Article,
  type ArticlePayload,
} from '../types/Article'
import {
  requestArticleList,
  requestArticleDetail,
  requestCreateArticle,
  requestUpdateArticle,
  requestDeleteArticle,
} from '../api/article'

export const useArticleStore = defineStore('article', () => {
  // ===== state：相当于 Bean 的字段 =====
  const state = ref<RequestState<ArticleData>>({
    status: 'loading',
  })

  // 详情页单独一份状态：不依赖列表是否加载过（直接刷新详情页也能显示）
  const detailState = ref<RequestState<Article>>({
    status: 'loading',
  })

  const articles = computed(() => (state.value.status === 'success' ? state.value.data.list : []))
  const articleDetail = computed(() =>
    detailState.value.status === 'success' ? detailState.value.data : null,
  )

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

  // 把 Article 转成提交给后端的结构（修改时用）
  function toPayload(article: Article, status: ArticleStatus): ArticlePayload {
    return {
      id: article.id,
      title: article.title,
      status,
      tags: article.tags,
      author: { id: article.author.id, name: article.author.name, avatar: article.author.avatar },
      stats: article.stats,
      publishedAt: article.publishedAt,
    }
  }

  // ===== actions：相当于 Bean 的业务方法。所有写操作都走这里，全部真调后端 =====
  async function publish(id: number) {
    const article = articles.value.find((a) => a.id === id)
    if (!article) return
    const res = await requestUpdateArticle(toPayload(article, 'published'))
    if (res.code === 0) {
      article.status = 'published'
    } else {
      alert('发布失败：' + res.msg)
    }
  }

  async function draft(id: number) {
    const article = articles.value.find((a) => a.id === id)
    if (!article) return
    const res = await requestUpdateArticle(toPayload(article, 'draft'))
    if (res.code === 0) {
      article.status = 'draft'
    } else {
      alert('保存草稿失败：' + res.msg)
    }
  }

  /** 新增文章。成功返回 true（弹窗据此关闭），失败弹提示并返回 false */
  async function addArticle(payload: ArticlePayload): Promise<boolean> {
    const res = await requestCreateArticle(payload)
    if (res.code === 0) {
      await loadArticles()
      return true
    }
    alert('新增失败：' + res.msg)
    return false
  }

  /** 修改文章。成功返回 true，失败弹提示并返回 false */
  async function editArticle(payload: ArticlePayload): Promise<boolean> {
    const res = await requestUpdateArticle(payload)
    if (res.code === 0) {
      await loadArticles()
      return true
    }
    alert('修改失败：' + res.msg)
    return false
  }

  async function removeArticle(id: number) {
    const res = await requestDeleteArticle(id)
    if (res.code === 0) {
      await loadArticles()
    } else {
      alert('删除失败：' + res.msg)
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

  async function loadArticleDetail(id: number) {
    detailState.value = { status: 'loading' }

    const res = await requestArticleDetail(id)
    if (res.code === 0) {
      detailState.value = { status: 'success', data: res.data }
    } else {
      detailState.value = { status: 'error', error: new Error(res.msg) }
    }
  }

  return {
    state,
    articles,
    filteredArticles,
    statusFilter,
    detailState,
    articleDetail,
    listByStatus,
    publish,
    draft,
    addArticle,
    editArticle,
    removeArticle,
    loadArticles,
    loadArticleDetail,
  }
})
