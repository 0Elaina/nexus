/**
 * 分类业务领域模型与 DTO/VO 契约
 * 严格与后端 nexus-category 和 nexus-common 分页对象 1:1 对齐
 */

export interface CategoryVO {
  id: number
  name: string
  slug?: string
  articleCount?: number
  createdAt?: string
  createTime?: string
  updatedAt?: string
  updateTime?: string
}

export interface CategorySaveDTO {
  name: string
}

export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages?: number
}

export interface CategoryPageParams {
  page?: number
  size?: number
}
