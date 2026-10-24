import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { getToken, clearToken } from './token'

// ===== 实例：统一配置，全站只用这一个 =====
export const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
  // adapter: mockAdapter, // 学习期用模拟后端；P 阶段删掉这行就换成真网络
})

// ===== 请求拦截器 ≈ Spring 的 ClientHttpRequestInterceptor / Filter =====
// 职责：每个请求出发前统一加工。这里演示带 token
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config // 必须返回 config，否则请求发不出去
})

// ===== 响应拦截器 ≈ 全局异常处理器 @RestControllerAdvice =====
// 职责：统一拆包 + 把 HTTP 层错误归一化。注意只管「网络 + HTTP」两层，
// 业务 code!==0 那层留给 useRequest（E1）—— 分层，别在一个拦截器里全干了
http.interceptors.response.use(
  // ① HTTP 2xx 走这里（哪怕业务 code 是 500 也走这里！）
  // 这里 return response.data 就是「拆包」。axios 的类型认为拦截器必须原样返回
  // AxiosResponse，所以拆包本质上是个类型谎 —— 官方给的逃生口：
  // 每个请求方法的**第二个泛型 R** 允许你声明「经过拦截器后实际返回什么类型」，
  // 调用处用它把类型修正回来（见 E2Demo.vue 的用法），这里参数故意不写类型标注
  (response) => {
    return response.data // axios 壳拆掉，返回 ApiResponse 本体
  },

  // ② HTTP 非 2xx / 网络错误 / 超时 走这里
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      // 有 response = 服务器回了，但状态码不对
      if (error.response.status === 401) {
        clearToken() // 过期/无效的 token 清掉
        // 真实项目这里跳登录页：router.push('/login')
        return Promise.reject(new Error('登录已失效，请重新登录'))
      }
      return Promise.reject(new Error(`服务器错误：HTTP ${error.response.status}`))
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时，请稍后重试'))
    }
    return Promise.reject(new Error('网络异常，请检查连接'))
  },
)
