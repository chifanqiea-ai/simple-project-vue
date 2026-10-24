import { type ArticleData, type Article, type ArticlePayload } from '../types/Article'
import { http } from '../utils/http'

// ===== 说明：业务 code 的判断已统一收编到 http.ts 的响应拦截器里 =====
// 这里的函数拿到的已经是"信封里的业务数据"本身；
// 业务失败 / HTTP 错误 / 网络错误都以"抛异常"的形式出现，由调用方 try/catch 接住

// 后端分页接口的真实结构（MyBatis-Plus 风格，字段名和前端约定不同）
interface BackendPage<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// ===== 查：分页列表。这里只做"形状翻译"（后端字段名 → 前端约定的字段名）=====
// 后端参数名是 pageNum（不是 page！），还支持按状态筛选、按标题模糊搜索
export async function requestArticleList(
  pageNum = 1,
  pageSize = 10,
  status?: string,
  keyword?: string,
): Promise<ArticleData> {
  const page = await http.get<unknown, BackendPage<Article>>('/article/page', {
    params: { pageNum, pageSize, ...(status ? { status } : {}), ...(keyword ? { keyword } : {}) },
  })

  return {
    list: page.records,
    pagination: {
      total: page.total,
      page: page.current,
      pageSize: page.size,
    },
  }
}

// ===== 查：单篇详情 =====
export async function requestArticleDetail(id: number): Promise<Article> {
  return http.get<unknown, Article>(`/article/${id}`)
}

// ===== 增 =====
export async function requestCreateArticle(payload: ArticlePayload): Promise<null> {
  return http.post<unknown, null>('/article', payload)
}

// ===== 改 =====
export async function requestUpdateArticle(payload: ArticlePayload): Promise<null> {
  return http.put<unknown, null>('/article', payload)
}

// ===== 删 =====
export async function requestDeleteArticle(id: number): Promise<null> {
  return http.delete<unknown, null>(`/article/${id}`)
}
