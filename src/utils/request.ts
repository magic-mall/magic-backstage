import axios from 'axios';
import router from '../router/index';
import { getToken,removeToken } from './auth';

export function request(config: any) {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
  })

  instance.interceptors.request.use((config: any) => {
    const token = getToken('token')
    if (token) {
      config.headers.common['Authorization'] = `Bearer ` + token
    }

    return config
  }, err => {
    if (err.response) {
      switch (err.response.status) {
        case 401:
          removeToken('token')
          router.replace({
            path: 'login',
            query: { redirect: router.currentRoute.value.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
    }
    return Promise.reject(err)
  })

  instance.interceptors.response.use(res => {
    if (res.status === 200) {
      return Promise.resolve(res);
    } else {
      return Promise.reject(res);
    }
  }, err => {
    return Promise.reject(err)
  })

  return instance(config)
}