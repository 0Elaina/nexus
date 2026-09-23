import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import request from '@/lib/api-client'
import type { PageResult } from '@/features/category/types'
import type {
  ArticleListItemVO,
  ArticleDetailVO,
  ArticlePageQuery,
  ArticleSaveDTO,
} from '../types'

export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (params: ArticlePageQuery) => [...articleKeys.lists(), params] as const,
  manageLists: () => [...articleKeys.all, 'manage-list'] as const,
  manageList: (params: ArticlePageQuery) => [...articleKeys.manageLists(), params] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...articleKeys.details(), String(id)] as const,
}

// 1. 公开分页查询文章（已发布）
export function useArticlePageQuery(params: ArticlePageQuery, enabled: boolean = true) {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: () =>
      request<PageResult<ArticleListItemVO>>({
        url: '/articles/page',
        method: 'GET',
        params,
      }),
    enabled,
  })
}

// 2. 后台管理端分页查询文章（包含草稿与发布态，受 @RequireRole 保护）
export function useManageArticlePageQuery(params: ArticlePageQuery, enabled: boolean = true) {
  return useQuery({
    queryKey: articleKeys.manageList(params),
    queryFn: () =>
      request<PageResult<ArticleListItemVO>>({
        url: '/articles/manage/page',
        method: 'GET',
        params,
      }),
    enabled,
  })
}

// 3. 查询文章详情（进入阅读态并触发阅读量削峰）
export function useArticleDetailQuery(id: number | string | undefined) {
  return useQuery({
    queryKey: articleKeys.detail(id ?? ''),
    queryFn: () =>
      request<ArticleDetailVO>({
        url: `/articles/${id}`,
        method: 'GET',
      }),
    enabled: Boolean(id),
  })
}

// 4. 创建发布文章
export function useCreateArticleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ArticleSaveDTO) =>
      request<string | number>({
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

// 5. 更新文章
export function useUpdateArticleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: ArticleSaveDTO }) =>
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

// 6. 删除文章
export function useDeleteArticleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) =>
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
