import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import request from '@/lib/api-client'
import type { PageResult } from '@/features/category/types'
import { articleKeys } from '@/features/article/api/articleApi'
import type { TagVO, TagSaveDTO, TagPageParams } from '../types'

export const tagKeys = {
  all: ['tags'] as const,
  allList: () => [...tagKeys.all, 'all-list'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (params: TagPageParams) => [...tagKeys.lists(), params] as const,
}

// 1. 获取全量标签列表（走后端 Redis 旁路缓存，公开免鉴权）
export function useAllTagsQuery() {
  return useQuery({
    queryKey: tagKeys.allList(),
    queryFn: () =>
      request<TagVO[]>({
        url: '/tags',
        method: 'GET',
      }),
  })
}

// 2. 服务端管理端物理分页查询标签
export function useTagPageQuery(params: TagPageParams, enabled: boolean = true) {
  return useQuery({
    queryKey: tagKeys.list(params),
    queryFn: () =>
      request<PageResult<TagVO>>({
        url: '/tags/page',
        method: 'GET',
        params,
      }),
    enabled,
  })
}

// 3. 新建标签 Mutation
export function useCreateTagMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TagSaveDTO | string) => {
      const name = typeof data === 'string' ? data : data.name
      return request<void>({
        url: '/tags',
        method: 'POST',
        params: { name },
      })
    },
    onSuccess: () => {
      toast.success('标签创制成功')
      queryClient.invalidateQueries({ queryKey: tagKeys.all })
      queryClient.invalidateQueries({ queryKey: articleKeys.all })
    },
  })
}

// 4. 更新标签 Mutation
export function useUpdateTagMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TagSaveDTO | string }) => {
      const name = typeof data === 'string' ? data : data.name
      return request<void>({
        url: `/tags/${id}`,
        method: 'PUT',
        params: { name },
      })
    },
    onSuccess: () => {
      toast.success('标签更新成功')
      queryClient.invalidateQueries({ queryKey: tagKeys.all })
      queryClient.invalidateQueries({ queryKey: articleKeys.all })
    },
  })
}

// 5. 删除标签 Mutation
export function useDeleteTagMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      request<void>({
        url: `/tags/${id}`,
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast.success('标签已移出工坊')
      queryClient.invalidateQueries({ queryKey: tagKeys.all })
      queryClient.invalidateQueries({ queryKey: articleKeys.all })
    },
  })
}
