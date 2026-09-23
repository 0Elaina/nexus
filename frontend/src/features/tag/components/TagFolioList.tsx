import React from 'react'
import { motion } from 'motion/react'
import { Edit3, Trash2, Tag as TagIcon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PageResult } from '@/features/category/types'
import type { TagVO } from '../types'
import { MOTION_CONFIG } from '@/config/motion'

interface TagFolioListProps {
  data?: PageResult<TagVO>
  isLoading?: boolean
  currentPage: number
  pageSize: number
  onPageChange: (newPage: number) => void
  editingTagId: number | null
  onEdit: (tag: TagVO) => void
  onDelete: (id: number) => void
  isDeleting: boolean
}

export function TagFolioList({
  data,
  isLoading,
  currentPage,
  pageSize,
  onPageChange,
  editingTagId,
  onEdit,
  onDelete,
  isDeleting,
}: TagFolioListProps) {
  const records = data?.records || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / pageSize) || 1

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-stone-200/60 rounded-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-white/60 rounded-2xl border border-white/60" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5 text-xs font-mono text-stone-500">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>印章卷宗列表 · 共 {total} 枚</span>
        </div>
        <div className="text-[11px] font-mono text-stone-400">
          第 {currentPage} / {totalPages} 页
        </div>
      </div>

      {records.length === 0 ? (
        <div className="p-12 text-center text-xs font-zen text-stone-400 soft-glass-panel rounded-2xl border border-white/80">
          工坊暂未录入任何印章标签
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((tag, index) => {
            const isEditing = editingTagId === tag.id
            const dateStr = (tag.createdAt || '').replace('T', ' ').substring(0, 10) || '近期'

            return (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: index * 0.03 }}
                className={`p-4 rounded-2xl soft-glass-panel border transition-all flex items-center justify-between gap-4 ${
                  isEditing
                    ? 'border-amber-400 bg-amber-50/50 shadow-diffuse-md'
                    : 'border-white/80 hover:border-white shadow-diffuse-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center font-mono text-xs shadow-xs">
                    <TagIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-zen font-bold text-sm text-stone-900">
                        #{tag.name}
                      </span>
                      {isEditing && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono">
                          修订中
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-stone-400 pt-0.5">
                      镌刻于 {dateStr}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(tag)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-zen text-stone-600 hover:text-stone-900 bg-white/70 hover:bg-white border border-stone-200/60 transition-colors apple-haptic shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>修订</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`确认要彻底移出印章标签「#${tag.name}」吗？`)) {
                        onDelete(tag.id)
                      }
                    }}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-zen text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/60 transition-colors apple-haptic shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>移出</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* 分页控制 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="rounded-full text-xs font-zen h-8 px-3 apple-haptic"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> 上一页
          </Button>
          <span className="text-xs font-mono text-stone-500 px-2">
            {currentPage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="rounded-full text-xs font-zen h-8 px-3 apple-haptic"
          >
            下一页 <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default TagFolioList
