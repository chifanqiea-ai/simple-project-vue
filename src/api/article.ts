import { type ApiResponse, type ArticleData, type Article, type ArticlePayload } from '../types/Article'
import { http } from '../utils/http'

// ===== 后端真实返回格式（对照后端 ArticleController / Result.java）=====
// 和本项目约定格式有三处不同：
//   1. 成功标记 code 是 200（本项目约定 0）
//   2. 列表字段叫 records（本项目约定 list）
//   3. 分页信息平铺（本项目约定包在 pagination 对象里）
interface BackendPage<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

interface BackendResult<T> {
  code: number
  msg: string
  data: T
}

// 翻译层（适配器）：把后端格式翻译成本项目约定格式，
// 之后 store / 页面 / 组件全部不用动；后端改格式也只改这里
function toFrontend<T>(res: BackendResult<T>): ApiResponse<T> {
  return { code: res.code === 200 ? 0 : res.code, msg: res.msg, data: res.data }
}

// ===== 查：分页列表。后端参数名是 pageNum（不是 page！），还支持按状态筛选、按标题模糊搜索 =====
export async function requestArticleList(
  pageNum = 1,
  pageSize = 10,
  status?: string,
  keyword?: string,
): Promise<ApiResponse<ArticleData>> {
  const res = await http.get<unknown, BackendResult<BackendPage<Article>>>('/article/page', {
    params: { pageNum, pageSize, ...(status ? { status } : {}), ...(keyword ? { keyword } : {}) },
  })

  // 业务出错时 data 是 null，直接读 records 会崩，这里给个安全的空值
  if (res.code !== 200) {
    return { code: res.code, msg: res.msg, data: { list: [], pagination: { total: 0, page: pageNum, pageSize } } }
  }

  return {
    ...toFrontend(res),
    data: {
      list: res.data.records,
      pagination: {
        total: res.data.total,
        page: res.data.current,
        pageSize: res.data.size,
      },
    },
  }
}

// ===== 查：单篇详情 =====
export async function requestArticleDetail(id: number): Promise<ApiResponse<Article>> {
  const res = await http.get<unknown, BackendResult<Article>>(`/article/${id}`)
  return toFrontend(res)
}

// ===== 增 =====
export async function requestCreateArticle(payload: ArticlePayload): Promise<ApiResponse<null>> {
  const res = await http.post<unknown, BackendResult<null>>('/article', payload)
  return toFrontend(res)
}

// ===== 改 =====
export async function requestUpdateArticle(payload: ArticlePayload): Promise<ApiResponse<null>> {
  const res = await http.put<unknown, BackendResult<null>>('/article', payload)
  return toFrontend(res)
}

// ===== 删 =====
export async function requestDeleteArticle(id: number): Promise<ApiResponse<null>> {
  const res = await http.delete<unknown, BackendResult<null>>(`/article/${id}`)
  return toFrontend(res)
}
