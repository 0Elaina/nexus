import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import request from '@/lib/api-client'
import type {
  CategoryVO,
  CategorySaveDTO,
  PageResult,
  CategoryPageParams,
} from '../types'

export const categoryKeys = {
  all: ['categories'] as const,
  allList: () => [...categoryKeys.all, 'all-list'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params: CategoryPageParams) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
}

// 0. 获取全量分类列表 (走后端 Redis 缓存)
export function useAllCategoriesQuery() {
  return useQuery({
    queryKey: categoryKeys.allList(),
    queryFn: () =>
      request<CategoryVO[]>({
        url: '/categories',
        method: 'GET',
      }),
  })
}

// 1. 服务端分页查询分类
export function useCategoryPageQuery(params: CategoryPageParams, enabled: boolean = true) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () =>
      request<PageResult<CategoryVO>>({
        url: '/categories/page',
        method: 'GET',
        params,
      }),
    enabled,
  })
}

// 2. 新增分类 Mutation
export function useCreateCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CategorySaveDTO | string) => {
      const name = typeof data === 'string' ? data : data.name
      return request<void>({
        url: '/categories',
        method: 'POST',
        params: { name },
      })
    },
    onSuccess: () => {
      toast.success('分类创建成功')
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

// 3. 修改分类 Mutation
export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategorySaveDTO | string }) => {
      const name = typeof data === 'string' ? data : data.name
      return request<void>({
        url: `/categories/${id}`,
        method: 'PUT',
        params: { name },
      })
    },
    onSuccess: () => {
      toast.success('分类更新成功')
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

// 4. 删除分类 Mutation
export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      request<void>({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast.success('分类已删除')
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}
