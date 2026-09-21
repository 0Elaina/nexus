import { useState, useMemo } from 'react'
import {
  useCategoryPageQuery,
  useAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../api/categoryApi'
import { CategoryCreationDesk } from '../components/CategoryCreationDesk'
import { CategoryFolioList } from '../components/CategoryFolioList'
import { CategoryVisitorShowcase } from '../components/CategoryVisitorShowcase'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { CategoryVO, CategorySaveDTO } from '../types'
import { LAYOUT_CONFIG } from '@/config/layout'

export function CategoryManagePage() {
  const [page, setPage] = useState(1)
  const pageSize = LAYOUT_CONFIG.DEFAULT_PAGE_SIZE

  // 鉴权与当前视点状态
  const { token, isAuthorMode } = useAuthStore()
  const isStudioMode = Boolean(token && isAuthorMode)

  // 当前正在编辑的分类（仅在工坊模式下使用）
  const [editingCategory, setEditingCategory] = useState<CategoryVO | null>(null)

  // 1. 仅在工坊管理模式下发起受保护的分页查询 (enabled = isStudioMode)
  const { data: pageData, isLoading: isPageLoading, refetch, isFetching } = useCategoryPageQuery(
    {
      page,
      size: pageSize,
    },
    isStudioMode
  )

  // 2. 访客探索模式下使用公开全量分类接口 (走 Redis 缓存，免鉴权守护)
  const { data: allCategories, isLoading: isAllLoading } = useAllCategoriesQuery()

  const createMutation = useCreateCategoryMutation()
  const updateMutation = useUpdateCategoryMutation()
  const deleteMutation = useDeleteCategoryMutation()

  // 统计当前页文章总数
  const totalArticlesOnPage = useMemo(() => {
    return (pageData?.records || []).reduce((acc, curr) => acc + (curr.articleCount || 0), 0)
  }, [pageData])

  const handleSubmit = async (dto: CategorySaveDTO) => {
    if (editingCategory) {
      await updateMutation.mutateAsync({ id: editingCategory.id, data: dto })
      setEditingCategory(null)
    } else {
      await createMutation.mutateAsync(dto)
    }
  }

  const handleDelete = (id: number) => {
    if (editingCategory?.id === id) {
      setEditingCategory(null)
    }
    deleteMutation.mutate(id)
  }

  // ==================== 1. 访客视点 (Visitor Mode) ====================
  // 当未登录或博主主动切换至“访客预览”态时，呈现纯净的分类画卷探索展台
  if (!isStudioMode) {
    return <CategoryVisitorShowcase data={allCategories} isLoading={isAllLoading} />
  }

  // ==================== 2. 博主工坊视点 (Author Studio Mode) ====================
  // 当博主认证登入且处于工坊模式时，呈递杂志跨页对偶创作台
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 左极 5 列 (约 40%)：常驻工坊创作台 (Creation Desk) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24">
        <CategoryCreationDesk
          editingCategory={editingCategory}
          onCancelEdit={() => setEditingCategory(null)}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          totalCategories={pageData?.total || 0}
          totalArticles={totalArticlesOnPage}
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
        />
      </div>

      {/* 右极 7 列 (约 60%)：手帖分镜文卷流 (Folio Rails) */}
      <div className="lg:col-span-7">
        <CategoryFolioList
          data={pageData}
          isLoading={isPageLoading}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          editingCategoryId={editingCategory?.id || null}
          onEdit={(cat) => setEditingCategory(cat)}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </div>
  )
}

export default CategoryManagePage
