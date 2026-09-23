import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { FolderTree, Tag as TagIcon } from 'lucide-react'
import {
  useCategoryPageQuery,
  useAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../api/categoryApi'
import {
  useAllTagsQuery,
  useTagPageQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from '@/features/tag/api/tagApi'
import { CategoryCreationDesk } from '../components/CategoryCreationDesk'
import { CategoryFolioList } from '../components/CategoryFolioList'
import { CategoryVisitorShowcase } from '../components/CategoryVisitorShowcase'
import { TagVisitorShowcase } from '@/features/tag/components/TagVisitorShowcase'
import { TagCreationDesk } from '@/features/tag/components/TagCreationDesk'
import { TagFolioList } from '@/features/tag/components/TagFolioList'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { CategoryVO, CategorySaveDTO } from '../types'
import type { TagVO, TagSaveDTO } from '@/features/tag/types'
import { LAYOUT_CONFIG } from '@/config/layout'
import { MOTION_CONFIG } from '@/config/motion'

export function CategoryManagePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') === 'tags' ? 'tags' : 'categories'

  const handleTabChange = (tab: 'categories' | 'tags') => {
    setSearchParams(tab === 'tags' ? { tab: 'tags' } : {})
  }

  // 鉴权与当前视点状态
  const { token, isAuthorMode } = useAuthStore()
  const isStudioMode = Boolean(token && isAuthorMode)
  const pageSize = LAYOUT_CONFIG.DEFAULT_PAGE_SIZE

  // ==================== 1. 分类切片状态与 Query ====================
  const [categoryPage, setCategoryPage] = useState(1)
  const [editingCategory, setEditingCategory] = useState<CategoryVO | null>(null)

  const {
    data: categoryPageData,
    isLoading: isCategoryPageLoading,
    refetch: refetchCategories,
    isFetching: isCategoryFetching,
  } = useCategoryPageQuery(
    { page: categoryPage, size: pageSize },
    isStudioMode && currentTab === 'categories'
  )
  const { data: allCategories, isLoading: isAllCategoriesLoading } = useAllCategoriesQuery()

  const createCategoryMutation = useCreateCategoryMutation()
  const updateCategoryMutation = useUpdateCategoryMutation()
  const deleteCategoryMutation = useDeleteCategoryMutation()

  const totalArticlesOnPage = useMemo(() => {
    return (categoryPageData?.records || []).reduce(
      (acc, curr) => acc + (curr.articleCount || 0),
      0
    )
  }, [categoryPageData])

  const handleCategorySubmit = async (dto: CategorySaveDTO) => {
    if (editingCategory) {
      await updateCategoryMutation.mutateAsync({ id: editingCategory.id, data: dto })
      setEditingCategory(null)
    } else {
      await createCategoryMutation.mutateAsync(dto)
    }
  }

  const handleCategoryDelete = (id: number) => {
    if (editingCategory?.id === id) {
      setEditingCategory(null)
    }
    deleteCategoryMutation.mutate(id)
  }

  // ==================== 2. 标签切片状态与 Query ====================
  const [tagPage, setTagPage] = useState(1)
  const [editingTag, setEditingTag] = useState<TagVO | null>(null)

  const { data: allTags, isLoading: isAllTagsLoading } = useAllTagsQuery()
  const {
    data: tagPageData,
    isLoading: isTagPageLoading,
    refetch: refetchTags,
    isFetching: isTagFetching,
  } = useTagPageQuery(
    { page: tagPage, size: pageSize },
    isStudioMode && currentTab === 'tags'
  )

  const createTagMutation = useCreateTagMutation()
  const updateTagMutation = useUpdateTagMutation()
  const deleteTagMutation = useDeleteTagMutation()

  const handleTagSubmit = async (dto: TagSaveDTO) => {
    if (editingTag) {
      await updateTagMutation.mutateAsync({ id: editingTag.id, data: dto })
      setEditingTag(null)
    } else {
      await createTagMutation.mutateAsync(dto)
    }
  }

  const handleTagDelete = (id: number) => {
    if (editingTag?.id === id) {
      setEditingTag(null)
    }
    deleteTagMutation.mutate(id)
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 顶部双轨跑道分段切换器 (Categories <-> Tags Switcher) */}
      <div className="flex items-center justify-center pt-2">
        <div className="inline-flex items-center p-1 rounded-full soft-glass-panel border border-white/80 shadow-diffuse-sm">
          <button
            type="button"
            onClick={() => handleTabChange('categories')}
            className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-zen font-semibold transition-colors apple-haptic ${
              currentTab === 'categories'
                ? 'text-stone-900'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {currentTab === 'categories' && (
              <motion.div
                layoutId="taxonomy-active-pill"
                className="absolute inset-0 bg-white rounded-full shadow-xs border border-black/5"
                transition={MOTION_CONFIG.SPRING_SNAPPY}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-indigo-600" />
              <span>分类体系 · Categories</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('tags')}
            className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-zen font-semibold transition-colors apple-haptic ${
              currentTab === 'tags' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {currentTab === 'tags' && (
              <motion.div
                layoutId="taxonomy-active-pill"
                className="absolute inset-0 bg-white rounded-full shadow-xs border border-black/5"
                transition={MOTION_CONFIG.SPRING_SNAPPY}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <TagIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>标签印章 · Tags</span>
            </span>
          </button>
        </div>
      </div>

      {/* ==================== 分类视点展台 ==================== */}
      {currentTab === 'categories' && (
        <>
          {!isStudioMode ? (
            <CategoryVisitorShowcase
              data={allCategories}
              isLoading={isAllCategoriesLoading}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <CategoryCreationDesk
                  editingCategory={editingCategory}
                  onCancelEdit={() => setEditingCategory(null)}
                  onSubmit={handleCategorySubmit}
                  isSubmitting={
                    createCategoryMutation.isPending || updateCategoryMutation.isPending
                  }
                  totalCategories={categoryPageData?.total || 0}
                  totalArticles={totalArticlesOnPage}
                  onRefresh={() => refetchCategories()}
                  isRefreshing={isCategoryFetching}
                />
              </div>

              <div className="lg:col-span-7">
                <CategoryFolioList
                  data={categoryPageData}
                  isLoading={isCategoryPageLoading}
                  currentPage={categoryPage}
                  pageSize={pageSize}
                  onPageChange={(p) => setCategoryPage(p)}
                  editingCategoryId={editingCategory?.id || null}
                  onEdit={(cat) => setEditingCategory(cat)}
                  onDelete={handleCategoryDelete}
                  isDeleting={deleteCategoryMutation.isPending}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== 标签视点展台 ==================== */}
      {currentTab === 'tags' && (
        <>
          {!isStudioMode ? (
            <TagVisitorShowcase data={allTags} isLoading={isAllTagsLoading} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <TagCreationDesk
                  editingTag={editingTag}
                  onCancelEdit={() => setEditingTag(null)}
                  onSubmit={handleTagSubmit}
                  isSubmitting={createTagMutation.isPending || updateTagMutation.isPending}
                  totalTags={tagPageData?.total || 0}
                  onRefresh={() => refetchTags()}
                  isRefreshing={isTagFetching}
                />
              </div>

              <div className="lg:col-span-7">
                <TagFolioList
                  data={tagPageData}
                  isLoading={isTagPageLoading}
                  currentPage={tagPage}
                  pageSize={pageSize}
                  onPageChange={(p) => setTagPage(p)}
                  editingTagId={editingTag?.id || null}
                  onEdit={(tag) => setEditingTag(tag)}
                  onDelete={handleTagDelete}
                  isDeleting={deleteTagMutation.isPending}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CategoryManagePage
