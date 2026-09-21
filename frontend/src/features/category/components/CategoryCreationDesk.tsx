import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Sparkles, RotateCw, X, FolderPlus, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { CategoryVO, CategorySaveDTO } from '../types'

interface CategoryCreationDeskProps {
  editingCategory: CategoryVO | null
  onCancelEdit: () => void
  onSubmit: (dto: CategorySaveDTO) => Promise<void> | void
  isSubmitting: boolean
  totalCategories: number
  totalArticles: number
  onRefresh: () => void
  isRefreshing: boolean
}

export function CategoryCreationDesk({
  editingCategory,
  onCancelEdit,
  onSubmit,
  isSubmitting,
  totalCategories,
  totalArticles,
  onRefresh,
  isRefreshing,
}: CategoryCreationDeskProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '')
    } else {
      setName('')
    }
  }, [editingCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      toast.error('请输入分类名称')
      return
    }

    onSubmit({ name: trimmedName })
    if (!editingCategory) {
      setName('')
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. 双语文学对位标题 (Dual-Language Counterpoint Heading) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono-code tracking-widest text-stone-400 font-semibold uppercase">
          01 / TAXONOMY
        </span>
        <h1 className="text-3xl font-bold font-zen text-stone-900 tracking-tight">
          分类秩序
        </h1>
        <p className="text-xs text-stone-500 font-sans leading-relaxed pt-1">
          维护文章所属分类体系，支持分类名称、访问标识（Slug）的即时录入与层级归纳。
        </p>
      </div>

      {/* 2. 工坊即时创作台面 (Creation & Edit Station) */}
      <div className="p-6 rounded-2xl soft-glass-panel border border-white/80 shadow-diffuse-sm relative overflow-hidden">
        {/* 顶部微高光提示 */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-seal flex items-center justify-center text-xs ${
                editingCategory
                  ? 'bg-accent-amber/15 text-accent-amber'
                  : 'bg-accent-indigo/15 text-accent-indigo'
              }`}
            >
              {editingCategory ? <Sparkles className="w-3.5 h-3.5" /> : <FolderPlus className="w-3.5 h-3.5" />}
            </div>
            <span className="font-zen font-bold text-sm text-stone-800">
              {editingCategory ? `编辑分类 · ${editingCategory.name}` : '新建内容分类'}
            </span>
          </div>

          {editingCategory && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
              className="h-7 px-2 text-[11px] text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-seal apple-haptic"
            >
              <X className="w-3 h-3 mr-1" />
              取消编辑
            </Button>
          )}
        </div>

        {/* 录入表单 (即写即存，零弹窗阻断) */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 font-zen flex items-center justify-between">
              <span>分类名称</span>
              <span className="text-[10px] text-stone-400 font-normal">如：技术思考、生活杂记</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入分类名称"
              disabled={isSubmitting}
              className="h-10 rounded-control bg-stone-50/70 border-stone-200 focus-visible:ring-accent-indigo/20 text-xs text-stone-900 font-zen placeholder:font-sans"
            />
          </div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-10 rounded-control text-xs font-medium text-white shadow-sm apple-haptic transition-all ${
                editingCategory
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-stone-900 hover:bg-stone-800'
              }`}
            >
              {isSubmitting ? (
                <span>处理中...</span>
              ) : editingCategory ? (
                <span className="flex items-center gap-1.5 font-zen">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  保存分类更新
                </span>
              ) : (
                <span className="flex items-center gap-1.5 font-zen">
                  <FolderPlus className="w-3.5 h-3.5" />
                  确认录入分类
                </span>
              )}
            </Button>
          </motion.div>
        </form>
      </div>

      {/* 3. 工坊数据脉络概览卡片 (Atelier Snapshot) */}
      <div className="p-4 rounded-2xl soft-glass-card border border-white/70 shadow-diffuse-sm flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div>
            <div className="text-[10px] uppercase font-mono-code text-stone-400">Total Categories</div>
            <div className="text-lg font-bold font-zen text-stone-800 leading-tight">
              {totalCategories} <span className="text-xs font-normal text-stone-400">个分类</span>
            </div>
          </div>
          <div className="w-[1px] h-6 bg-black/10"></div>
          <div>
            <div className="text-[10px] uppercase font-mono-code text-stone-400">Linked Articles</div>
            <div className="text-lg font-bold font-zen text-stone-800 leading-tight">
              {totalArticles} <span className="text-xs font-normal text-stone-400">篇收录博文</span>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 px-2.5 rounded-seal text-xs text-stone-600 border-stone-200/80 hover:bg-white apple-haptic"
        >
          <RotateCw className={`w-3.5 h-3.5 mr-1 text-stone-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>
    </div>
  )
}
