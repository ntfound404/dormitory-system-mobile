import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores/token.js'

const routes = [
  {
    path: '/',
    redirect: '/login' // 重定向到 login 页面
  },
  { path: '/login', component: () => import('@/views/login.vue') },
  { path: '/register', component: () => import('@/views/register.vue') },
  {
    path: '/Layout',
    component: () => import('@/views/Layout.vue'),
    children: [
      {
        path: '/notice',
        component: () => import('@/views/notice/notices.vue')
      },
      {
        path: '/my',
        component: () => import('@/views/user/index.vue')
      },
      {
        path: '/check',
        component: () => import('@/views/check/check.vue')
      }
    ]
  }
  , {
    path: '/userInfo',
    component: () => import('@/views/user/userInfo.vue')
  }, {
    path: '/studentInfo',
    component: () => import('@/views/user/studentInfo.vue')
  }
]

// 创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 设置全局前置守卫
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore();

  // 如果路由跳转到非登录页面，并且没有登录（即没有 token）
  if (to.path !== '/login' && to.path !== '/register' && !tokenStore.token) {
    ElMessage.error('请先登录');
    next('/login'); // 跳转到登录页面
  } else {
    next(); // 继续访问目标页面
  }
})

export default router
