import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Sparkles,
  Save,
  Feather,
  Folder,
  Tag as TagIcon,
  FileText,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { MdEditor } from 'md-editor-rt'
import { toast } from 'sonner'
import {
  useArticleDetailQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
} from '../api/articleApi'
import { useAllCategoriesQuery } from '@/features/category/api/categoryApi'
import { useAllTagsQuery } from '@/features/tag/api/tagApi'
import { MOTION_CONFIG } from '@/config/motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  // 查询现有文章数据（若为编辑态）
  const { data: existingArticle, isLoading: isArticleLoading } = useArticleDetailQuery(id)

  // 查询所有可用分类与标签
  const { data: categories = [] } = useAllCategoriesQuery()
  const { data: allTags = [] } = useAllTagsQuery()

  const createMutation = useCreateArticleMutation()
  const updateMutation = useUpdateArticleMutation()

  // 表单状态
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [tagIds, setTagIds] = useState<number[]>([])
  const [summary, setSummary] = useState('')
  const [status, setStatus] = useState<number>(1) // 默认 1: 正式发布, 0: 草稿
  const [showSummaryDrawer, setShowSummaryDrawer] = useState(false)

  // 回显已有文章数据
  useEffect(() => {
    if (existingArticle && isEditing) {
      setTitle(existingArticle.title || '')
      setContent(existingArticle.content || '')
      setCategoryId(existingArticle.categoryId ? Number(existingArticle.categoryId) : undefined)
      setSummary(existingArticle.summary || '')
      setStatus(existingArticle.status ?? 1)
      setTagIds(existingArticle.tags ? existingArticle.tags.map((t) => t.id) : [])
    }
  }, [existingArticle, isEditing])

  // 当分类加载完成后，新建态默认选中首个分类
  useEffect(() => {
    if (!isEditing && !categoryId && categories.length > 0) {
      setCategoryId(categories[0].id)
    }
  }, [categories, categoryId, isEditing])

  // 切换标签选中状态
  const toggleTag = (targetTagId: number) => {
    setTagIds((prev) => {
      if (prev.includes(targetTagId)) {
        return prev.filter((i) => i !== targetTagId)
      }
      if (prev.length >= 10) {
        toast.warning('一篇篇章最多关联 10 个标签')
        return prev
      }
      return [...prev, targetTagId]
    })
  }

  // 提交保存 / 发布
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle) {
      toast.error('请输入篇章题名')
      return
    }
    if (!trimmedContent) {
      toast.error('篇章正文内容不能为空')
      return
    }
    if (!categoryId) {
      toast.error('请选择文章所属分类')
      return
    }

    const payload = {
      title: trimmedTitle,
      content: trimmedContent,
      categoryId,
      summary: summary.trim() || undefined,
      status,
      tagIds: tagIds.length > 0 ? tagIds : undefined,
    }

    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data: payload })
        navigate(`/articles/${id}`)
      } else {
        const newArticleId = await createMutation.mutateAsync(payload)
        navigate(`/articles/${newArticleId}`)
      }
    } catch {
      // 错误由 api-client 全局拦截器提示
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  if (isEditing && isArticleLoading) {
    return (
      <div className="max-w-stage-max mx-auto py-24 text-center text-xs font-zen text-stone-400 animate-pulse">
        工坊装载中，正在调取篇章原稿...
      </div>
    )
  }

  return (
    <div className="max-w-stage-max mx-auto space-y-6 pb-20">
      {/* 顶部控制轴与操作条 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={MOTION_CONFIG.ENTRANCE_TRANSITION}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl soft-glass-panel border border-white/80 shadow-diffuse-sm"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/articles')}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors apple-haptic"
            title="放弃并返回"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-mono tracking-cold text-amber-700">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>02 / ATELIER · 创作工坊</span>
            </div>
            <h1 className="font-zen text-base sm:text-lg font-bold text-stone-900">
              {isEditing ? '修订篇章手帖' : '撰写新篇章'}
            </h1>
          </div>
        </div>

        {/* 右侧：状态切换与一键盖印发布 */}
        <div className="flex items-center gap-3">
          {/* 草稿 / 发布分段拟物开关 */}
          <div className="flex items-center p-0.5 rounded-full bg-stone-100/90 border border-stone-200/60 text-xs font-zen">
            <button
              type="button"
              onClick={() => setStatus(0)}
              className={`px-3 py-1 rounded-full transition-all apple-haptic ${
                status === 0
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              存为草稿
            </button>
            <button
              type="button"
              onClick={() => setStatus(1)}
              className={`px-3 py-1 rounded-full transition-all apple-haptic ${
                status === 1
                  ? 'bg-amber-500 text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              正式发布
            </button>
          </div>

          {/* 盖印提交按钮 */}
          <Button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="h-9 px-5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-zen font-semibold shadow-sm apple-haptic"
          >
            {isSubmitting ? (
              '盖印入卷中...'
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" />
                {isEditing ? '保存修订' : status === 1 ? '盖印发布' : '保存草稿'}
              </span>
            )}
          </Button>
        </div>
      </motion.div>

      {/* 篇章元数据配置卡卷 (Metadata Desk) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: 0.05 }}
        className="p-6 rounded-2xl soft-glass-panel border border-white/80 shadow-diffuse-sm space-y-5"
      >
        {/* 1. 题名输入框 */}
        <div className="space-y-1.5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="写下这篇故事或架构思考的题名..."
            className="h-12 text-lg sm:text-xl font-zen font-bold text-stone-900 bg-white/70 border-stone-200/70 rounded-xl focus:ring-1 focus:ring-amber-500 placeholder:text-stone-300"
          />
        </div>

        {/* 2. 分类与标签挂载行 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* 分类下拉选择 */}
          <div className="space-y-1.5">
            <label className="text-xs font-zen font-semibold text-stone-700 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-stone-400" />
              <span>所属分类手帖 (必选)</span>
            </label>
            <select
              value={categoryId ?? ''}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-xl bg-white/70 border border-stone-200/70 text-xs font-zen text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.articleCount || 0} 篇)
                </option>
              ))}
            </select>
          </div>

          {/* 标签多选胶囊池 */}
          <div className="space-y-1.5">
            <label className="text-xs font-zen font-semibold text-stone-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TagIcon className="w-3.5 h-3.5 text-stone-400" />
                <span>关联印章标签 (可选，至多 10 项)</span>
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                已选 {tagIds.length} 项
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-white/50 border border-stone-200/60 min-h-10 max-h-24 overflow-y-auto">
              {allTags.length === 0 ? (
                <span className="text-[11px] text-stone-400 font-sans italic">
                  暂无可选标签（可于后续阶段在标签文库中录入）
                </span>
              ) : (
                allTags.map((tag) => {
                  const isSelected = tagIds.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono transition-all apple-haptic ${
                        isSelected
                          ? 'bg-stone-900 text-white font-medium shadow-xs'
                          : 'bg-white/80 text-stone-600 border border-stone-200/60 hover:bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>#{tag.name}</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* 3. 可选摘要手账抽屉 */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowSummaryDrawer(!showSummaryDrawer)}
            className="flex items-center gap-1.5 text-xs font-zen text-stone-500 hover:text-stone-800 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {showSummaryDrawer ? '收起引首摘要配置' : '展开引首摘要配置 (留空则由后端自动提取首段纯文本)'}
            </span>
            {showSummaryDrawer ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showSummaryDrawer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2"
            >
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="键入自定义摘要（最多 300 字符，不填则由后端自适应智能萃取）..."
                className="w-full p-3 rounded-xl bg-white/70 border border-stone-200/70 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans leading-relaxed"
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* 4. 双栏实时 Markdown 编辑器工作台 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: 0.1 }}
        className="rounded-2xl overflow-hidden soft-glass-panel border border-white/80 shadow-diffuse-sm"
      >
        <MdEditor
          modelValue={content}
          onChange={setContent}
          previewTheme="default"
          style={{ height: '680px', borderRadius: '1rem' }}
          placeholder="在此挥洒晨曦中的灵光、架构沉思或工匠物理笔记..."
        />
      </motion.div>
    </div>
  )
}

export default ArticleEditorPage
