import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../api/categoryApi'
import type { CategoryVO, CategorySaveDTO } from '../types'

interface CategoryFormModalProps {
  open?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  editingCategory?: CategoryVO | null
  initialData?: CategoryVO | null
  onSubmit?: (data: CategorySaveDTO) => Promise<void> | void
  isSubmitting?: boolean
}

export function CategoryFormModal({
  open,
  isOpen,
  onOpenChange,
  onClose,
  editingCategory,
  initialData,
  onSubmit,
  isSubmitting = false,
}: CategoryFormModalProps) {
  const isModalOpen = open ?? isOpen ?? false
  const activeCategory = editingCategory ?? initialData ?? null

  const [name, setName] = useState('')

  const createMutation = useCreateCategoryMutation()
  const updateMutation = useUpdateCategoryMutation()

  const handleOpenChange = (newVal: boolean) => {
    onOpenChange?.(newVal)
    if (!newVal) {
      onClose?.()
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      if (activeCategory) {
        setName(activeCategory.name || '')
      } else {
        setName('')
      }
    }
  }, [isModalOpen, activeCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      toast.error('请输入分类名称')
      return
    }

    const payload: CategorySaveDTO = { name: trimmedName }

    if (onSubmit) {
      await onSubmit(payload)
      handleOpenChange(false)
    } else {
      if (activeCategory) {
        await updateMutation.mutateAsync({ id: activeCategory.id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      handleOpenChange(false)
    }
  }

  const submitting = isSubmitting || createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-2xl border border-white/80 bg-white/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-bold font-zen text-stone-900">
            {activeCategory ? '编辑分类' : '新建分类'}
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500 font-sans">
            维护文章所属分类，规范站点内容组织与检索脉络。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 font-zen">
              分类名称
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：技术分享、生活随笔、架构探幽"
              maxLength={50}
              className="h-10 text-xs rounded-xl"
            />
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
              className="h-9 px-4 rounded-xl text-xs"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-9 px-4 rounded-xl text-xs bg-stone-900 hover:bg-stone-800 text-white font-medium shadow-sm"
            >
              {submitting ? '保存中...' : '确认保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default CategoryFormModal
