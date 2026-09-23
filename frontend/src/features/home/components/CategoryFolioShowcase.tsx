import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Sparkles, FolderPlus, ArrowRight, FileText, Trash2, Edit3 } from 'lucide-react'
import { useAllCategoriesQuery, useDeleteCategoryMutation } from '@/features/category/api/categoryApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import { MOTION_CONFIG } from '@/config/motion'
import { CategoryFormModal } from '@/features/category/components/CategoryFormModal'
import type { CategoryVO } from '@/features/category/types'

// 缺省优雅启幕分类（保障首次访问时画卷即完整呈现）
const DEFAULT_FOLIOS: CategoryVO[] = [
  { id: 1, name: '架构探幽', slug: 'architecture', articleCount: 8, createTime: '2026-09-20', updateTime: '2026-09-20' },
  { id: 2, name: '设计物理学', slug: 'design-craft', articleCount: 5, createTime: '2026-09-20', updateTime: '2026-09-20' },
  { id: 3, name: '日常随笔', slug: 'essays', articleCount: 12, createTime: '2026-09-18', updateTime: '2026-09-18' },
  { id: 4, name: '工具炼金', slug: 'tooling', articleCount: 4, createTime: '2026-09-15', updateTime: '2026-09-15' },
]

export const CategoryFolioShowcase: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthorMode } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryVO | null>(null)

  // 1. 查询真实分类数据 (走后端 Redis 缓存)
  const { data: realCategories, isLoading } = useAllCategoriesQuery()
  const deleteMutation = useDeleteCategoryMutation()

  const folios = (realCategories && realCategories.length > 0) ? realCategories : DEFAULT_FOLIOS

  const handleOpenCreate = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cat: CategoryVO, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingCategory(cat)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`确定要移除分类「${name}」吗？`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <section id="folios" className="py-16 px-6 max-w-stage-max mx-auto space-y-10">
      {/* 栏目文学标题 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/60 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono tracking-cold text-amber-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>02 / FOLIO CATALOGUE · 手帖文库</span>
          </div>
          <h2 className="font-zen text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            藏书票书匣
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-zen">
            每一枚分类如同带温润印记的藏书票，串联起整座博客的知识脉络。
          </p>
        </div>

        {/* 交互按钮 */}
        <div className="flex items-center gap-2.5">
          {isAuthorMode && (
            <motion.button
              type="button"
              onClick={handleOpenCreate}
              whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 text-stone-50 text-xs font-medium shadow-sm hover:bg-stone-800 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>新建手帖分类</span>
            </motion.button>
          )}

          <motion.button
            type="button"
            onClick={() => navigate('/categories')}
            whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full soft-glass-panel text-stone-700 text-xs font-medium hover:bg-white transition-colors"
          >
            <span>进入分类专题</span>
            <ArrowRight className="w-3 h-3 opacity-60" />
          </motion.button>
        </div>
      </div>

      {/* 藏书票书匣网格 (Washi Folio Chest Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {folios.map((folio, index) => (
          <motion.div
            key={folio.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: index * 0.06 }}
            whileHover={{ y: -3 }}
            onClick={() => navigate('/categories')}
            className="group cursor-pointer relative p-5 rounded-2xl soft-glass-panel border border-white/80 hover:border-white shadow-diffuse-sm hover:shadow-diffuse-md transition-all flex flex-col justify-between min-h-42.5"
          >
            {/* 顶栏：藏书票打孔与 Slug 冷标 */}
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[11px] font-mono tracking-wider text-stone-400">
                  #{folio.slug || `cat-${folio.id}`}
                </span>

                {/* 博主模式下的微距管理按钮 */}
                {isAuthorMode && (
                  <div className="flex items-center gap-1 ml-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(folio, e)}
                      className="p-1 hover:bg-stone-200/60 rounded text-stone-600 hover:text-stone-900 transition-colors"
                      title="编辑分类"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(folio.id, folio.name, e)}
                      className="p-1 hover:bg-rose-100 rounded text-rose-500 hover:text-rose-700 transition-colors"
                      title="删除分类"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 中段：分类中文主名 */}
            <div className="my-2 space-y-1">
              <h3 className="font-zen text-lg font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
                {folio.name}
              </h3>
              <p className="text-[11px] text-stone-400 font-mono">
                收录归档手帖
              </p>
            </div>

            {/* 底栏：收录篇章印章与微箭头 */}
            <div className="pt-3 border-t border-stone-100/80 flex items-center justify-between text-xs">
              <span className="washi-seal washi-seal-amber font-mono text-[11px]">
                <FileText className="w-3 h-3" />
                {folio.articleCount || 0} 篇文卷
              </span>

              <span className="text-stone-300 group-hover:text-amber-600 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 新增/编辑分类弹窗 */}
      <CategoryFormModal
        isOpen={isModalOpen}
        initialData={editingCategory}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}
