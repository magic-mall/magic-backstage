import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false }) // 不显示加载圈

// element plus
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn';
import 'element-plus/dist/index.css'

// 缓存token
import { getToken } from './utils/auth';

// 路由拦截
router.beforeEach((to, from, next) => {
  let token = getToken('token')
  if (to.meta.requiresAuth) {
    if (token) {
      NProgress.start()
      next()
    } else {
      NProgress.start()
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    if (token) {
      NProgress.start()
      next({
        path: '/home',
      })
    } else {
      NProgress.start()
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

const app = createApp(App)

app.use(ElementPlus, { locale })

app.use(store).use(router).mount('#app')

export default app