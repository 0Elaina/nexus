import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  FileText,
  Calendar,
  Clock,
  Sparkles,
  Eye,
  Search,
  Plus,
  Tag as TagIcon,
  Edit3,
  Trash2,
  Folder,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  useArticlePageQuery,
  useManageArticlePageQuery,
  useDeleteArticleMutation,
} from '../api/articleApi'
import { useAllCategoriesQuery } from '@/features/category/api/categoryApi'
import { useAllTagsQuery } from '@/features/tag/api/tagApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import { MOTION_CONFIG } from '@/config/motion'
import { Button } from '@/components/ui/button'

const STARTER_ARTICLES = [
  {
    id: '1',
    title: 'Nexus 工坊启幕：关于这座数字庭院的物语与工程构想',
    summary:
      '从 Vue 3 迁移到 React 19，彻底推翻了机械表格的枷锁，将二次元物语灵魂、漫画跨页分镜与苹果级微距物理学融为一体，构建出这片具有生活温度的创作场域。',
    categoryId: '1',
    categoryName: '架构沉思',
    status: 1,
    viewCount: 328,
    tags: [{ id: 1, name: 'React 19' }, { id: 2, name: '物语设计' }],
    createdAt: '2026-09-21 14:00',
    updatedAt: '2026-09-21 14:00',
  },
  {
    id: '2',
    title: '流体空间重力学：如何打破三列卡片的公式化桎梏',
    summary:
      '天际线通透保护、核心路标与物性外设的抽屉隐喻分权，以及在现代 Web 中如何借助 SwiftUI 弹簧动力学实现纯粹安定阅读态。',
    categoryId: '2',
    categoryName: '设计工艺',
    status: 1,
    viewCount: 194,
    tags: [{ id: 3, name: '空间重力学' }],
    createdAt: '2026-09-20 18:30',
    updatedAt: '2026-09-20 18:30',
  },
  {
    id: '3',
    title: 'Spring Boot 模块单体与 Redis 旁路缓存演进手记',
    summary:
      '从单一应用解耦为业务垂直切片，StringRedisTemplate 强类型防击穿治理与 @RequireRole AOP 声明式鉴权的闭环工程实践。',
    categoryId: '1',
    categoryName: '架构沉思',
    status: 1,
    viewCount: 246,
    tags: [{ id: 4, name: 'Spring Boot' }, { id: 5, name: 'Redis' }],
    createdAt: '2026-09-19 21:15',
    updatedAt: '2026-09-19 21:15',
  },
]

export function ArticleListPage() {
  const navigate = useNavigate()
  const { token, isAuthorMode } = useAuthStore()
  const isStudioMode = Boolean(token && isAuthorMode)

  const [searchParams] = useSearchParams()
  const initialTagId = searchParams.get('tagId') ? Number(searchParams.get('tagId')) : undefined
  const initialCategoryId = searchParams.get('categoryId')
    ? Number(searchParams.get('categoryId'))
    : undefined

  const [page, setPage] = useState(1)
  const pageSize = 10
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(initialCategoryId)
  const [selectedTag, setSelectedTag] = useState<number | undefined>(initialTagId)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [manageStatus, setManageStatus] = useState<number | undefined>(undefined) // undefined: 全部, 1: 已发布, 0: 草稿箱

  // 当外部链接或路由参数变化时，自动激活对应筛选
  useEffect(() => {
    const tId = searchParams.get('tagId') ? Number(searchParams.get('tagId')) : undefined
    const cId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
    if (tId !== undefined) {
      setSelectedTag(tId)
      setPage(1)
    }
    if (cId !== undefined) {
      setSelectedCategory(cId)
      setPage(1)
    }
  }, [searchParams])

  // 1. 查询全量元数据（分类与标签）
  const { data: categories = [] } = useAllCategoriesQuery()
  const { data: allTags = [] } = useAllTagsQuery()

  // 2. 区分工坊管理态与访客阅览态的分页查询
  const publicQuery = useArticlePageQuery(
    {
      page,
      size: pageSize,
      categoryId: selectedCategory,
      tagIds: selectedTag ? [selectedTag] : undefined,
      keyword: searchKeyword.trim() || undefined,
    },
    !isStudioMode
  )

  const manageQuery = useManageArticlePageQuery(
    {
      page,
      size: pageSize,
      categoryId: selectedCategory,
      tagIds: selectedTag ? [selectedTag] : undefined,
      keyword: searchKeyword.trim() || undefined,
      status: manageStatus,
    },
    isStudioMode
  )

  const deleteMutation = useDeleteArticleMutation()

  const currentQuery = isStudioMode ? manageQuery : publicQuery
  const pageData = currentQuery.data
  const isLoading = currentQuery.isLoading

  const rawRecords = pageData?.records || []
  // 若后端无真实数据且非草稿模式，回退至优雅示范数据展示
  const articles =
    rawRecords.length > 0
      ? rawRecords
      : isStudioMode && manageStatus === 0
      ? []
      : STARTER_ARTICLES

  const totalPages = pageData ? Math.ceil(pageData.total / pageSize) : 1

  const handleDelete = (e: React.MouseEvent, id: string | number, title: string) => {
    e.stopPropagation()
    if (window.confirm(`确定要彻底删除篇章《${title}》吗？此操作无法撤销。`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-8 max-w-stage-max mx-auto pb-16">
      {/* 栏目头部 */}
      <div className="text-center space-y-2 max-w-xl mx-auto pt-4 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-stone-200/60 text-[11px] font-mono tracking-cold text-sky-700 shadow-diffuse-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>01 / ARTICLES · 博文长卷</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-zen text-stone-900 tracking-tight">
          博文阅览
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-zen leading-relaxed">
          写在晨曦与夜空之间的日子，收录架构探幽、前端工匠物理学与日常灵光。
        </p>
      </div>

      {/* 工坊模式控制展台：草稿箱切换与撰写新篇章快捷按键 */}
      {isStudioMode && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 shadow-diffuse-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-zen font-semibold text-amber-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>篇章管理视点：</span>
            </span>
            <div className="inline-flex items-center p-0.5 rounded-full bg-white/80 border border-amber-200 text-xs font-zen">
              <button
                type="button"
                onClick={() => {
                  setManageStatus(undefined)
                  setPage(1)
                }}
                className={`px-3 py-1 rounded-full transition-colors apple-haptic ${
                  manageStatus === undefined
                    ? 'bg-stone-900 text-white font-medium'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                全部篇章
              </button>
              <button
                type="button"
                onClick={() => {
                  setManageStatus(1)
                  setPage(1)
                }}
                className={`px-3 py-1 rounded-full transition-colors apple-haptic ${
                  manageStatus === 1
                    ? 'bg-stone-900 text-white font-medium'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                已正式发布
              </button>
              <button
                type="button"
                onClick={() => {
                  setManageStatus(0)
                  setPage(1)
                }}
                className={`px-3 py-1 rounded-full transition-colors apple-haptic ${
                  manageStatus === 0
                    ? 'bg-amber-600 text-white font-medium'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                草稿箱
              </button>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => navigate('/articles/write')}
            className="w-full sm:w-auto h-9 px-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-zen font-semibold shadow-sm apple-haptic flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>撰写新篇章</span>
          </Button>
        </motion.div>
      )}

      {/* 搜索与分类/标签多维过滤胶囊栏 */}
      <div className="p-4 rounded-2xl soft-glass-panel border border-white/80 shadow-diffuse-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 分类快捷标签 */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(undefined)
                setPage(1)
              }}
              className={`px-3 py-1 rounded-full text-xs font-zen transition-colors apple-haptic ${
                selectedCategory === undefined
                  ? 'bg-stone-900 text-stone-50 font-medium'
                  : 'bg-white/60 text-stone-600 hover:bg-white'
              }`}
            >
              全部分类
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setPage(1)
                }}
                className={`px-3 py-1 rounded-full text-xs font-zen transition-colors apple-haptic ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-stone-50 font-medium'
                    : 'bg-white/60 text-stone-600 hover:bg-white'
                }`}
              >
                {cat.name} ({cat.articleCount || 0})
              </button>
            ))}
          </div>

          {/* 检索输入框 */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value)
                setPage(1)
              }}
              placeholder="检索篇章标题..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/70 border border-stone-200/60 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
            />
          </div>
        </div>

        {/* 标签过滤微胶囊行 */}
        {allTags.length > 0 && (
          <div className="pt-2 border-t border-black/4 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1 mr-1">
              <TagIcon className="w-3 h-3 text-stone-400" />
              标签筛选:
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedTag(undefined)
                setPage(1)
              }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-colors ${
                selectedTag === undefined
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100/70 text-stone-500 hover:bg-stone-200/80'
              }`}
            >
              全部标签
            </button>
            {allTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  setSelectedTag(selectedTag === tag.id ? undefined : tag.id)
                  setPage(1)
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-colors ${
                  selectedTag === tag.id
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'bg-white/70 text-stone-600 border border-stone-200/60 hover:bg-white'
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 篇章卡卷流 */}
      <div className="space-y-4">
        {articles.length === 0 ? (
          <div className="py-16 text-center text-xs font-zen text-stone-400 soft-glass-panel rounded-2xl border border-white/80">
            暂无匹配的篇章记录
          </div>
        ) : (
          articles.map((article, index) => {
            const dateStr = (article.createdAt || '').replace('T', ' ').substring(0, 10)
            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: index * 0.04 }}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/articles/${article.id}`)}
                className="p-6 rounded-2xl soft-glass-panel border border-white/80 hover:border-white shadow-diffuse-sm hover:shadow-diffuse-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    {/* 分类印章 */}
                    {article.categoryName && (
                      <span className="washi-seal washi-seal-indigo">
                        {article.categoryName}
                      </span>
                    )}

                    {/* 草稿状态印章 */}
                    {article.status === 0 && (
                      <span className="washi-seal washi-seal-amber">
                        工坊草稿
                      </span>
                    )}

                    {/* 标签流 */}
                    {article.tags?.map((t) => (
                      <span key={t.id} className="washi-seal washi-seal-emerald">
                        #{t.name}
                      </span>
                    ))}

                    <span className="text-stone-400 ml-1">{dateStr}</span>
                  </div>

                  <h3 className="font-zen text-lg sm:text-xl font-bold text-stone-800 group-hover:text-sky-700 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 text-xs font-mono text-stone-400 shrink-0">
                  <span className="flex items-center gap-1 text-sky-600 font-semibold">
                    <Eye className="w-3.5 h-3.5" /> {article.viewCount ?? 0} 次翻阅
                  </span>

                  {/* 工坊模式管理触点 */}
                  {isStudioMode && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/articles/edit/${article.id}`)
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-zen font-medium transition-colors apple-haptic"
                      >
                        <Edit3 className="w-3 h-3 text-amber-600" />
                        <span>编辑</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, article.id, article.title)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-zen font-medium transition-colors apple-haptic"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>删除</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.article>
            )
          })
        )}
      </div>

      {/* 物理分页栏 (若有多页) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full text-xs font-zen h-8 px-3 apple-haptic"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> 上一页
          </Button>
          <span className="text-xs font-mono text-stone-500 px-2">
            {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full text-xs font-zen h-8 px-3 apple-haptic"
          >
            下一页 <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ArticleListPage
