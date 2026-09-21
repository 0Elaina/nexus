/**
 * 文章业务切片强类型定义 (对齐后端 nexus-article 模块)
 */

export interface ArticleListItemVO {
  id: number
  title: string
  summary: string
  categoryId: number
  categoryName: string
  status: number
  views: number
  createTime: string
  updateTime: string
}

export interface ArticleVO extends ArticleListItemVO {
  content: string
}

export interface ArticlePageQuery {
  page?: number
  size?: number
  categoryId?: number
  keyword?: string
}

export interface ArticleSaveDTO {
  title: string
  summary?: string
  content: string
  categoryId: number
  status?: number
}
