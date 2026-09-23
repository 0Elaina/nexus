import { useMutation, useQueryClient } from '@tanstack/react-query'
import request from '@/lib/api-client'
import { useAuthStore } from '../store/authStore'

/**
 * 用户注销 Mutation（向后端通知注销，将 JWT 加入 Redis 黑名单）
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return useMutation({
    mutationFn: () =>
      request<void>({
        url: '/auth/logout',
        method: 'POST',
      }),
    onSettled: () => {
      // 无论后端是否返回 200 还是 401 凭证过期，均清空本地认证凭证
      clearAuth()
      queryClient.clear()
    },
  })
}
