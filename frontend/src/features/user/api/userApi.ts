import { useQuery } from '@tanstack/react-query'
import request from '@/lib/api-client'
import type { BloggerProfileVO } from '../types'

export const userKeys = {
  all: ['users'] as const,
  blogger: () => [...userKeys.all, 'blogger'] as const,
}

/**
 * 获取博主公开名片（严格脱敏，免鉴权公开）
 */
export function useBloggerProfileQuery() {
  return useQuery({
    queryKey: userKeys.blogger(),
    queryFn: () =>
      request<BloggerProfileVO>({
        url: '/users/blogger',
        method: 'GET',
      }),
  })
}
