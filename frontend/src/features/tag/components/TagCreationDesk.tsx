import React, { useState, useEffect } from 'react'
import { Sparkles, RotateCw, X, Tag as TagIcon, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { TagVO, TagSaveDTO } from '../types'

interface TagCreationDeskProps {
  editingTag: TagVO | null
  onCancelEdit: () => void
  onSubmit: (dto: TagSaveDTO) => Promise<void> | void
  isSubmitting: boolean
  totalTags: number
  onRefresh: () => void
  isRefreshing: boolean
}

export function TagCreationDesk({
  editingTag,
  onCancelEdit,
  onSubmit,
  isSubmitting,
  totalTags,
  onRefresh,
  isRefreshing,
}: TagCreationDeskProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name || '')
    } else {
      setName('')
    }
  }, [editingTag])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      toast.error('请输入标签名称')
      return
    }

    if (trimmedName.length > 50) {
      toast.error('标签名称不能超过 50 个字符')
      return
    }

    onSubmit({ name: trimmedName })
    if (!editingTag) {
      setName('')
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. 双语文学对位标题 */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono-code tracking-widest text-stone-400 font-semibold uppercase">
          02 / INDEX
        </span>
        <h1 className="text-3xl font-bold font-zen text-stone-900 tracking-tight">
          印章工坊
        </h1>
        <p className="text-xs text-stone-500 font-sans leading-relaxed pt-1">
          镌刻文章所属主题标签，支持标签名称的即时录入、更名与多维关联索引。
        </p>
      </div>

      {/* 2. 工坊即时创作台面 */}
      <div className="p-6 rounded-2xl soft-glass-panel border border-white/80 shadow-diffuse-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-seal flex items-center justify-center text-xs ${
                editingTag
                  ? 'bg-accent-amber/15 text-accent-amber'
                  : 'bg-accent-emerald/15 text-accent-emerald'
              }`}
            >
              {editingTag ? <Sparkles className="w-3.5 h-3.5" /> : <TagIcon className="w-3.5 h-3.5" />}
            </div>
            <span className="font-zen font-bold text-sm text-stone-800">
              {editingTag ? `修订印章 · #${editingTag.name}` : '创制新印章标签'}
            </span>
          </div>

          {editingTag && (
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

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="text-xs font-zen font-semibold text-stone-700">
              印章标签名
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：React 19、Spring Boot..."
              maxLength={50}
              className="h-10 bg-white/60 border-stone-200/70 text-xs font-zen rounded-control focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-zen font-semibold rounded-control shadow-xs apple-haptic"
          >
            {isSubmitting ? '盖印入卷中...' : editingTag ? '保存印章修订' : '创制并盖印'}
          </Button>
        </form>

        {/* 宏观指标卡卷 */}
        <div className="mt-6 pt-4 border-t border-black/[0.04] grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-xl soft-concave-card">
            <div className="text-[10px] font-mono text-stone-400">已收录印章</div>
            <div className="text-xl font-bold font-zen text-stone-800 pt-0.5">
              {totalTags}
            </div>
          </div>
          <div className="p-3 rounded-xl soft-concave-card flex flex-col justify-center items-center">
            <div className="text-[10px] font-mono text-stone-400">多对多体系</div>
            <div className="text-xs font-zen text-emerald-600 font-semibold pt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 零 N+1 装配
            </div>
          </div>
        </div>

        {/* 刷新触点 */}
        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-400 hover:text-stone-700 transition-colors"
          >
            <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>刷新印章缓存</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TagCreationDesk
