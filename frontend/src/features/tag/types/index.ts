/**
 * 标签领域视图对象强契约 (对齐后端 nexus-tag 模块)
 */

export interface TagVO {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface TagSaveDTO {
  name: string
}

export interface TagPageParams {
  page?: number
  size?: number
}
