import React, { useId } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Sparkles,
  Bookmark,
  Edit3,
  Tag as TagIcon,
  BookOpen,
  Share2,
} from 'lucide-react'
import { MdPreview, MdCatalog } from 'md-editor-rt'
import { toast } from 'sonner'
import { useArticleDetailQuery } from '../api/articleApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import { MOTION_CONFIG } from '@/config/motion'
import { Button } from '@/components/ui/button'

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, isAuthorMode } = useAuthStore()
  const isStudioMode = Boolean(token && isAuthorMode)
  const editorId = useId()

  const { data: article, isLoading, error } = useArticleDetailQuery(id)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('篇章链接已复制至剪贴板')
  }

  // 1. 加载态骨架屏 (Washi Shimmer Skeleton)
  if (isLoading) {
    return (
      <div className="max-w-stage-max mx-auto py-8 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-stone-200/60 rounded-full" />
        <div className="h-10 w-3/4 bg-stone-200/70 rounded-xl" />
        <div className="h-5 w-1/2 bg-stone-200/50 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-8 h-96 bg-white/60 rounded-2xl border border-white/60" />
          <div className="hidden lg:block lg:col-span-4 h-64 bg-white/40 rounded-2xl border border-white/40" />
        </div>
      </div>
    )
  }

  // 2. 异常或未找到篇章 (404 Not Found)
  if (error || !article) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <BookOpen className="w-8 h-8 opacity-60" />
        </div>
        <h2 className="font-zen text-2xl font-bold text-stone-800">
          篇章未寻得
        </h2>
        <p className="text-xs text-stone-500 font-sans leading-relaxed">
          该篇章可能已被作者移入草稿箱、归档或链接有误。
        </p>
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/articles')}
            className="rounded-full text-xs font-zen apple-haptic"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            返回博文画卷
          </Button>
        </div>
      </div>
    )
  }

  // 估算阅读时长（按每分钟 400 字）
  const readingMinutes = Math.max(1, Math.ceil((article.content?.length || 0) / 400))
  const formattedDate = article.createdAt
    ? article.createdAt.replace('T', ' ').substring(0, 16)
    : '近期'

  return (
    <div className="max-w-stage-max mx-auto space-y-8 pb-20">
      {/* 顶部导航与操作横轴 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={MOTION_CONFIG.ENTRANCE_TRANSITION}
        className="flex items-center justify-between gap-4 pt-2"
      >
        <button
          type="button"
          onClick={() => navigate('/articles')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full soft-glass-card hover:bg-white text-xs font-zen text-stone-600 hover:text-stone-900 transition-colors apple-haptic shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回博文篇章</span>
        </button>

        <div className="flex items-center gap-2">
          {/* 工坊模式快捷编辑触点 */}
          {isStudioMode && (
            <button
              type="button"
              onClick={() => navigate(`/articles/edit/${article.id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-zen font-semibold shadow-xs transition-colors apple-haptic"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>编辑此篇</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            title="复制篇章链接"
            className="p-2 rounded-full soft-glass-card hover:bg-white text-stone-500 hover:text-stone-800 transition-colors apple-haptic shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* 卷首标题与文学对位元数据区 */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: 0.05 }}
        className="space-y-4 max-w-3xl"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/70 border border-stone-200/60 text-[11px] text-sky-700 tracking-cold shadow-diffuse-sm">
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span>01 / CHRONICLE · 卷首手帖</span>
          </span>

          {/* 分类和纸徽记 */}
          {article.categoryName && (
            <span className="washi-seal washi-seal-indigo">
              {article.categoryName}
            </span>
          )}

          {/* 草稿状态指示 */}
          {article.status === 0 && (
            <span className="washi-seal washi-seal-amber">
              工坊草稿
            </span>
          )}
        </div>

        <h1 className="font-zen text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* 篇章元信息指引行 */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-500 pt-1">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{formattedDate}</span>
          </span>
          <span className="text-stone-300">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>约 {readingMinutes} 分钟翻阅</span>
          </span>
          <span className="text-stone-300">·</span>
          <span className="flex items-center gap-1.5 text-sky-600 font-semibold">
            <Eye className="w-3.5 h-3.5" />
            <span>{article.viewCount} 次翻阅</span>
          </span>
        </div>

        {/* 关联和纸标签流 */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <TagIcon className="w-3 h-3 text-stone-400 mr-0.5" />
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="washi-seal washi-seal-emerald text-[11px]"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </motion.header>

      {/* 桌面端双列分栏画卷：左侧正文卷轴 + 右侧 sticky 大纲目录 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左极 8~9 列：主阅读卷轴 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: 0.1 }}
          className="lg:col-span-8 xl:col-span-9 space-y-6"
        >
          <div className="p-6 sm:p-10 rounded-2xl soft-glass-panel border border-white/80 shadow-diffuse-sm relative overflow-hidden">
            {/* 可选摘要便签衬底 */}
            {article.summary && (
              <div className="mb-8 p-4 rounded-xl bg-stone-50/80 border border-stone-200/50 relative text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-amber-100/90 text-amber-800 text-[10px] font-mono rounded-full font-semibold border border-amber-200/60 shadow-xs">
                  ★ 篇章引首
                </span>
                {article.summary}
              </div>
            )}

            {/* Markdown 正文和纸渲染区 */}
            <div className="nexus-markdown-wrapper prose prose-stone max-w-none">
              <MdPreview
                editorId={editorId}
                modelValue={article.content || ''}
                previewTheme="default"
              />
            </div>

            {/* 文末物语落款 */}
            <div className="mt-12 pt-6 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400 font-mono">
              <div className="flex items-center gap-1.5 font-zen text-stone-500">
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                <span>写在晨曦与夜空之间 · Nexus 工坊手帖</span>
              </div>
              <div>更新于 {article.updatedAt?.split('T')[0] || formattedDate}</div>
            </div>
          </div>
        </motion.div>

        {/* 右极 3~4 列：sticky 悬浮大纲目录 */}
        <motion.aside
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: 0.15 }}
          className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24 space-y-4"
        >
          <div className="p-5 rounded-2xl soft-glass-card border border-white/70 shadow-diffuse-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-black/4 text-xs font-zen font-bold text-stone-800">
              <Bookmark className="w-3.5 h-3.5 text-sky-600" />
              <span>大纲目录 · TOC</span>
            </div>
            <div className="text-xs text-stone-600 max-h-[70vh] overflow-y-auto pr-1">
              <MdCatalog
                editorId={editorId}
                scrollElement="html"
              />
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}

export default ArticleDetailPage
