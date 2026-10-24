import { type ApiResponse, type ArticleData, type Article } from '../types/Article'
import { http } from '../utils/http'

// ===== 后端真实返回格式（联调实测 http://localhost:8080/api/article/page 得到）=====
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

interface BackendResponse<T> {
  code: number
  msg: string
  data: BackendPage<T>
}

export async function requestArticleList(page = 1, pageSize = 10): Promise<ApiResponse<ArticleData>> {
  // 真实后端接口是 /article/page；page=第几页，pageSize=每页几条。
  // 有默认值，所以调用处不用改也能工作（先联调第 1 页、每页 10 条）
  const res = await http.get<unknown, BackendResponse<Article>>('/article/page', {
    params: { page, pageSize },
  })

  // 翻译层（适配器）：把后端格式翻译成本项目约定格式，
  // 之后 store / 页面 / 组件全部不用动；后端改格式也只改这里
  return {
    code: res.code === 200 ? 0 : res.code,
    msg: res.msg,
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
