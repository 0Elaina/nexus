import axios, { type AxiosRequestConfig } from "axios";
import { createDiscreteApi } from "naive-ui";

// 独立创建消息提示工具
const { message } = createDiscreteApi(['message']);

// 创建 Axios 实例
const http = axios.create({
    baseURL: '/api',
    timeout: 10000
});

// 请求拦截器
http.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// 响应拦截器
http.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res.code === 'SUCCESS') {
            return res.data;
        }
        message.error(res.message || '业务处理失败');
        return Promise.reject(new Error(res.message || 'Error'));
    },
    (error) => {
        const errorMessage = error.response?.data?.message || error.message || '网络连接异常';
        message.error(errorMessage);
        return Promise.reject(error);
    }
)

export default function request<T>(config: AxiosRequestConfig): Promise<T> {
    return http.request(config) as unknown as Promise<T>;
}