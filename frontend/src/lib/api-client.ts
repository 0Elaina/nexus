import axios, { type AxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth/store/authStore'

export interface Result<T = unknown> {
  code: string
  message: string
  data: T
}

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器：自动注入 Bearer Token
http.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一解析 Result<T> 响应与异常处理
http.interceptors.response.use(
  (response) => {
    const res = response.data as Result<unknown>
    // 后端规范：code 为 SUCCESS 或 200 即代表业务成功
    if (res.code === 'SUCCESS' || res.code === '200') {
      return res.data as never
    }

    const errorMsg = res.message || '业务请求处理失败'
    toast.error(errorMsg)
    return Promise.reject(new Error(errorMsg))
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      toast.error('登录凭证已过期或无效，请重新登录')
    } else {
      const errorMsg =
        error.response?.data?.message || error.message || '网络连接异常，请检查后端服务'
      toast.error(errorMsg)
    }
    return Promise.reject(error)
  }
)

export default function request<T>(config: AxiosRequestConfig): Promise<T> {
  return http.request(config) as unknown as Promise<T>
}
