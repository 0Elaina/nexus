import { useState } from 'react'
import { motion } from 'motion/react'
import { FileText, Edit3, Trash2, ChevronLeft, ChevronRight, Layers, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import type { CategoryVO, PageResult } from '../types'

interface CategoryFolioListProps {
  data?: PageResult<CategoryVO>
  isLoading: boolean
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  editingCategoryId?: number | null
  onEdit: (category: CategoryVO) => void
  onDelete: (id: number) => void
  isDeleting: boolean
}

export function CategoryFolioList({
  data,
  isLoading,
  currentPage,
  pageSize,
  onPageChange,
  editingCategoryId,
  onEdit,
  onDelete,
  isDeleting,
}: CategoryFolioListProps) {
  const [deleteTarget, setDeleteTarget] = useState<CategoryVO | null>(null)

  const records = data?.records || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / pageSize) || 1

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return dateStr.replace('T', ' ').substring(0, 16)
  }

  return (
    <div className="space-y-4">
      {/* 栏目标题与信息扫描标尺 */}
      <div className="flex items-center justify-between px-2 pb-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 font-mono-code uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-accent-indigo" />
          <span>FOLIO RAILS · 收录文卷</span>
        </div>
        <div className="text-xs text-stone-400 font-sans">
          第 <span className="font-semibold text-stone-700 font-mono-code">{currentPage}</span> / {totalPages} 页
          <span className="mx-2 text-stone-300">·</span>
          共 <span className="font-semibold text-stone-700 font-mono-code">{total}</span> 条归档
        </div>
      </div>

      {/* 手帖卡槽文卷流 (Folio Cards Stream) */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="h-64 rounded-2xl soft-glass-panel flex flex-col items-center justify-center gap-3 text-stone-400 text-xs">
            <span className="w-3 h-3 rounded-full bg-sky-500 animate-ping"></span>
            <span className="font-zen">正在加载手帖文卷...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="h-64 rounded-2xl soft-glass-panel flex flex-col items-center justify-center gap-2 text-stone-400 text-xs text-center p-6">
            <p className="font-zen text-sm text-stone-600">手帖暂无分类文卷</p>
            <p className="font-sans text-stone-400">在左侧工坊创作台输入名称与 Slug，即刻开辟新的知识脉络。</p>
          </div>
        ) : (
          records.map((category, index) => {
            const isBeingEdited = editingCategoryId === category.id
            const displayIndex = String((currentPage - 1) * pageSize + index + 1).padStart(2, '0')

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className={`group p-5 rounded-2xl soft-glass-panel shadow-diffuse-sm transition-all duration-200 ${
                  isBeingEdited
                    ? 'border-amber-400/60 bg-amber-50/30 shadow-md ring-1 ring-amber-400/40'
                    : 'border-white/80 hover:border-white hover:shadow-diffuse-md hover:-translate-y-0.5'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* 左侧：序号冷标 + 分类名 + Slug 芯片 */}
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="font-mono-code font-bold text-xs text-stone-300 group-hover:text-accent-indigo transition-colors pt-0.5 sm:pt-0">
                      {displayIndex}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-zen font-bold text-base text-stone-900 group-hover:text-accent-indigo transition-colors tracking-tight">
                          {category.name}
                        </h3>
                        {isBeingEdited && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-seal bg-amber-100 text-amber-700 font-zen font-medium">
                            编辑中
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-stone-500 bg-stone-100/90 px-2 py-0.5 rounded-md border border-stone-200/50">
                          #{category.slug || `cat-${category.id}`}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {formatDate(category.updatedAt || category.updateTime || category.createdAt || category.createTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 右侧：博文收录和纸印章 + 操作按钮 */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.03]">
                    <Badge variant="washiIndigo" className="px-3 py-1 font-zen">
                      <FileText className="w-3.5 h-3.5 mr-1 text-accent-indigo" />
                      <span>{category.articleCount ?? 0} 篇博文</span>
                    </Badge>

                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(category)}
                        className={`h-8 px-2.5 rounded-control text-xs apple-haptic ${
                          isBeingEdited
                            ? 'bg-amber-100 text-amber-800'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1 text-stone-400" />
                        <span>编辑</span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(category)}
                        className="h-8 px-2.5 rounded-control text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50/70 apple-haptic"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1 opacity-70" />
                        <span>删除</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* 底部分页控制器 (舒展独立隔离) */}
      <div className="flex items-center justify-between px-5 py-4 rounded-card glass-panel border border-white/80 bg-white/40 mt-4">
        <span className="text-xs text-stone-500 font-sans">
          共 <span className="font-semibold text-stone-800 font-mono-code">{total}</span> 个手帖分类
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 px-3 rounded-control text-xs text-stone-600 border-stone-200/80 hover:bg-white apple-haptic"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
            前一页
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 px-3 rounded-control text-xs text-stone-600 border-stone-200/80 hover:bg-white apple-haptic"
          >
            后一页
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </div>
      </div>

      {/* 删除二次确认弹窗 */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[420px] p-6 rounded-card border border-white/80 bg-white/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-zen text-stone-900">
              确认删除手帖分类
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-600 pt-2 leading-relaxed font-sans">
              确定要移除分类{' '}
              <span className="font-semibold text-stone-900 font-zen">
                “{deleteTarget?.name}”
              </span>{' '}
              吗？此操作将彻底删除该分类索引。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
              className="h-9 px-4 rounded-control text-xs text-stone-600 border-stone-200 hover:bg-stone-100 apple-haptic"
            >
              取消
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={confirmDelete}
              className="h-9 px-4 rounded-control text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm apple-haptic"
            >
              {isDeleting ? '正在移除...' : '确认移除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
