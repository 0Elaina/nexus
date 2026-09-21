import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import request from '@/lib/api-client'
import type { PageResult } from '@/features/category/types'
import type {
  ArticleListItemVO,
  ArticleVO,
  ArticlePageQuery,
  ArticleSaveDTO,
} from '../types'

export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (params: ArticlePageQuery) => [...articleKeys.lists(), params] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (id: number) => [...articleKeys.details(), id] as const,
}

// 1. 公开分页查询文章
export function useArticlePageQuery(params: ArticlePageQuery) {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: () =>
      request<PageResult<ArticleListItemVO>>({
        url: '/articles/page',
        method: 'GET',
        params,
      }),
  })
}

// 2. 查询文章详情
export function useArticleDetailQuery(id: number) {
  return useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: () =>
      request<ArticleVO>({
        url: `/articles/${id}`,
        method: 'GET',
      }),
    enabled: !!id,
  })
}

// 3. 发布文章
export function useCreateArticleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ArticleSaveDTO) =>
      request<number>({
        url: '/articles',
        method: 'POST',
        data,
      }),
    onSuccess: () => {
      toast.success('篇章发布成功')
      queryClient.invalidateQueries({ queryKey: articleKeys.all })
    },
  })
}

// 4. 更新文章
export function useUpdateArticleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ArticleSaveDTO }) =>
      request<void>({
        url: `/articles/${id}`,
        method: 'PUT',
        data,
      }),
    onSuccess: () => {
      toast.success('篇章更新成功')
      queryClient.invalidateQueries({ queryKey: articleKeys.all })
    },
  })
}

// 5. 删除文章
export function useDeleteArticleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      request<void>({
        url: `/articles/${id}`,
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast.success('篇章已删除')
      queryClient.invalidateQueries({ queryKey: articleKeys.all })
    },
  })
}
