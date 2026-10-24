import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '../stores/auth'
import { storeToRefs } from 'pinia'



// 路由表 列表页、详情页
const routes = [
  {
    name: 'ArticleList',
    path: '/',
    component: () => import('../pages/ArticleListPage.vue'),
  },
  {
    name: 'ArticleDetail',
    path: '/article/:id',
    component: () => import('../pages/ArticleDetailPage.vue'),
    meta: { requiresAuth: true },
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // 之前误写成 routes: []，导致路由表没交给路由器，页面永远空白
})

//路由守卫 检查登录状态
router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    // 守卫运行时 Pinia 已安装，这里取登录状态才安全
    const { isLoggedIn } = storeToRefs(useLoginStore())
    if (!isLoggedIn.value) {
      alert('请先登录')
      return '/' // 没登录 → 重定向回列表页（拦截）
    }
  }
})


export default router

