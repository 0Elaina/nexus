import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Edit3, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import type { CategoryVO, PageResult } from '../types'

interface CategoryTableProps {
  data?: PageResult<CategoryVO>
  isLoading: boolean
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onEdit: (category: CategoryVO) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export function CategoryTable({
  data,
  isLoading,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  isDeleting = false,
}: CategoryTableProps) {
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

  // 格式化日期为 YYYY-MM-DD HH:mm
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return dateStr.replace('T', ' ').substring(0, 16)
  }

  return (
    <div className="w-full rounded-2xl glass-panel border border-white/80 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-stone-50/70 border-b border-black/5">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="py-4 px-6 text-xs font-semibold text-stone-500 font-mono tracking-wider">
              分类名称
            </TableHead>
            <TableHead className="py-4 px-6 text-xs font-semibold text-stone-500 font-mono tracking-wider">
              访问标识 (SLUG)
            </TableHead>
            <TableHead className="py-4 px-6 text-xs font-semibold text-stone-500 font-mono tracking-wider">
              收录文章数
            </TableHead>
            <TableHead className="py-4 px-6 text-xs font-semibold text-stone-500 font-mono tracking-wider">
              最后更新时间
            </TableHead>
            <TableHead className="py-4 px-6 text-right text-xs font-semibold text-stone-500 font-mono tracking-wider">
              操作
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-44 text-center text-xs text-stone-400">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                  <span>正在加载分类数据...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-44 text-center text-xs text-stone-400">
                暂无分类数据，点击上方“新建分类”开始归纳博文。
              </TableCell>
            </TableRow>
          ) : (
            records.map((category) => (
              <TableRow
                key={category.id}
                className="hover:bg-white/70 transition-colors duration-150 border-b border-black/4"
              >
                <TableCell className="py-4 px-6 font-medium text-xs text-stone-900 font-zen">
                  {category.name}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100/90 text-stone-600 font-mono-code text-[11px] border border-stone-200/60">
                    {category.slug}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge variant="washiIndigo">
                    <FileText className="w-3 h-3 text-accent-indigo" />
                    <span>{category.articleCount ?? 0} 篇</span>
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-stone-400 font-mono">
                  {formatDate(category.updateTime || category.createTime)}
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(category)}
                      className="h-8 px-2.5 rounded-lg text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 apple-haptic"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1 text-stone-400" />
                      编辑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(category)}
                      className="h-8 px-2.5 rounded-lg text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50/70 apple-haptic"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1 opacity-70" />
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 底部分页器独立隔离栏 */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-black/5 bg-white/40">
        <div className="text-xs text-stone-500 font-sans">
          共 <span className="font-semibold text-stone-800">{total}</span> 个分类
          <span className="mx-2 text-stone-300">|</span>
          第 <span className="font-semibold text-stone-800">{currentPage}</span> / {totalPages} 页
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 px-3 rounded-lg text-xs text-stone-600 border-stone-200 hover:bg-white apple-haptic"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
            上一页
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 px-3 rounded-lg text-xs text-stone-600 border-stone-200 hover:bg-white apple-haptic"
          >
            下一页
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </div>
      </div>

      {/* 删除二次确认弹窗 */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-105 p-6 rounded-2xl border border-white/80 bg-white/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-zen text-stone-900">
              确认删除分类
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-600 pt-2 leading-relaxed">
              确定要删除分类{' '}
              <span className="font-semibold text-stone-900 font-zen">
                “{deleteTarget?.name}”
              </span>{' '}
              吗？此操作将彻底移除该分类记录。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
              className="h-9 px-4 rounded-xl text-xs text-stone-600 border-stone-200 hover:bg-stone-100 apple-haptic"
            >
              取消
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={confirmDelete}
              className="h-9 px-4 rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm apple-haptic"
            >
              {isDeleting ? '正在删除...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
