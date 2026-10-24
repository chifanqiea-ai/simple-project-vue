export interface Author {
  id: number
  name: string
  avatar: string
}

export interface Stats {
  views: number
  likes: number
}

export interface Pagination {
  total: number
  page: number
  pageSize: number
}

export type ArticleStatus = 'draft' | 'published' | 'archived'
export type ArticleFilter = ArticleStatus | 'all'

export interface Article {
  id: number
  title: string
  status: ArticleStatus
  tags: string[]
  author: Author
  stats: Stats
  publishedAt: string
}

export interface ArticleData {
  list: Article[]
  pagination: Pagination
}

export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

export type RequestState<T> =
  { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: Error }

export type ArticleResponse = ApiResponse<ArticleData>

/** 新增/修改文章时提交给后端的数据。新增不用带 id，修改必须带 id */
export interface ArticlePayload {
  id?: number
  title: string
  status: ArticleStatus
  tags: string[]
  author: { id?: number; name: string; avatar?: string }
  stats?: Stats
  publishedAt?: string | null
}

export function isNotNullObj(x: unknown): x is object {
  return x !== null && typeof x === 'object'
}

export function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((item) => typeof item === 'string') //判断数组中每个元素是否满足测试条件
}

export type ArticleStatusMap = Record<ArticleStatus, string> //映射之后的类型{draft:string,published:string,archived:string}
export const statusMap: ArticleStatusMap = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档', //如果漏掉archived，那么类型 "{ draft: string; published: string; }" 中缺少属性 "archived"，但类型 "ArticleStatusMap" 中需要该属性。
} //实例化ArticleStatusMap类型

export type ArticleFilterMap = Record<ArticleFilter, string>
export const filterStatusMap: ArticleFilterMap = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档',
  all: '全部',
}


export function isAuthor(x: unknown): x is Author {
  return (
    isNotNullObj(x) &&
    'id' in x &&
    'name' in x &&
    'avatar' in x &&
    typeof x.id === 'number' &&
    typeof x.name === 'string' &&
    typeof x.avatar === 'string'
  )
}

export function isStats(x: unknown): x is Stats {
  return (
    isNotNullObj(x) &&
    'views' in x &&
    'likes' in x &&
    typeof x.views === 'number' &&
    typeof x.likes === 'number'
  )
}

export function isArticleStatus(x: unknown): x is ArticleStatus {
  return ['draft', 'published', 'archived'].includes(x as ArticleStatus)
}

export function isArticle(x: unknown): x is Article {
  return (
    isNotNullObj(x) &&
    'id' in x &&
    'title' in x &&
    'status' in x &&
    'tags' in x &&
    'author' in x &&
    'stats' in x &&
    'publishedAt' in x &&
    typeof x.id === 'number' &&
    typeof x.title === 'string' &&
    isArticleStatus(x.status) &&
    isStringArray(x.tags) &&
    isAuthor(x.author) &&
    isStats(x.stats) &&
    typeof x.publishedAt === 'string'
  )
}

