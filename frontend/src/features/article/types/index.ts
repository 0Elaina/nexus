import type { TagVO } from '@/features/tag/types'

/**
 * 文章业务切片强契约定义 (严格对齐后端 nexus-article 模块)
 */

export interface ArticleListItemVO {
  id: string
  title: string
  summary: string
  categoryId: string
  categoryName?: string
  status: number
  viewCount: number
  tags: TagVO[]
  createdAt: string
  updatedAt: string
}

export interface ArticleDetailVO {
  id: string
  title: string
  summary: string
  content: string
  categoryId: string
  categoryName?: string
  status: number
  viewCount: number
  tags: TagVO[]
  createdAt: string
  updatedAt: string
}

export interface ArticlePageQuery {
  page?: number
  size?: number
  categoryId?: number
  keyword?: string
  status?: number
  sortBy?: string
  tagIds?: number[]
  matchAllTags?: boolean
  isAsc?: boolean
}

export interface ArticleSaveDTO {
  title: string
  content: string
  categoryId: number
  summary?: string
  status: number
  tagIds?: number[]
}
