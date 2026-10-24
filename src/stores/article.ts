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
import { useToast } from '../utils/toast'

// 把各种异常统一取成给人看的话（业务错误/HTTP 错误/网络错误都会被拦截器包成 Error）
function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

export const useArticleStore = defineStore('article', () => {
  // 气泡提示（公共喇叭）：成功失败都用它，替代会被浏览器静音的 alert
  const { showToast } = useToast()
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
  // 失败以"抛异常"出现（拦截器统一抛的），这里 try/catch 接住转成弹窗提示
  async function publish(id: number) {
    const article = articles.value.find((a) => a.id === id)
    if (!article) return
    try {
      await requestUpdateArticle(toPayload(article, 'published'))
      article.status = 'published'
      showToast('发布成功')
    } catch (e) {
      showToast('发布失败：' + errMsg(e))
    }
  }

  async function draft(id: number) {
    const article = articles.value.find((a) => a.id === id)
    if (!article) return
    try {
      await requestUpdateArticle(toPayload(article, 'draft'))
      article.status = 'draft'
      showToast('已保存草稿')
    } catch (e) {
      showToast('保存草稿失败：' + errMsg(e))
    }
  }

  /** 新增文章。成功返回 true（弹窗据此关闭），失败弹提示并返回 false */
  async function addArticle(payload: ArticlePayload): Promise<boolean> {
    try {
      await requestCreateArticle(payload)
      await loadArticles()
      showToast('新增成功')
      return true
    } catch (e) {
      showToast('新增失败：' + errMsg(e))
      return false
    }
  }

  /** 修改文章。成功返回 true，失败弹提示并返回 false */
  async function editArticle(payload: ArticlePayload): Promise<boolean> {
    try {
      await requestUpdateArticle(payload)
      await loadArticles()
      showToast('修改成功')
      return true
    } catch (e) {
      showToast('修改失败：' + errMsg(e))
      return false
    }
  }

  async function removeArticle(id: number) {
    try {
      await requestDeleteArticle(id)
      await loadArticles()
      showToast('删除成功')
    } catch (e) {
      showToast('删除失败：' + errMsg(e))
    }
  }

  async function loadArticles() {
    state.value = { status: 'loading' }

    try {
      const data = await requestArticleList()
      state.value = { status: 'success', data }
    } catch (e) {
      state.value = { status: 'error', error: e instanceof Error ? e : new Error(String(e)) }
    }
  }

  async function loadArticleDetail(id: number) {
    detailState.value = { status: 'loading' }

    try {
      const data = await requestArticleDetail(id)
      detailState.value = { status: 'success', data }
    } catch (e) {
      detailState.value = { status: 'error', error: e instanceof Error ? e : new Error(String(e)) }
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
