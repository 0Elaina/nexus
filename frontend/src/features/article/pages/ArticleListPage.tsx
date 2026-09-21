import React, { useState } from 'react'
import { motion } from 'motion/react'
import { FileText, Calendar, Clock, Sparkles, Eye, Search, Plus, Filter } from 'lucide-react'
import { useArticlePageQuery } from '../api/articleApi'
import { useAllCategoriesQuery } from '@/features/category/api/categoryApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import { MOTION_CONFIG } from '@/config/motion'
import type { ArticleListItemVO } from '../types'

const STARTER_ARTICLES: ArticleListItemVO[] = [
  {
    id: 1,
    title: 'Nexus 工坊启幕：关于这座数字庭院的物语与工程构想',
    summary: '从 Vue 3 迁移到 React 19，彻底推翻了机械表格的枷锁，将二次元物语灵魂、漫画跨页分镜与苹果级微距物理学融为一体，构建出这片具有生活温度的创作场域。',
    categoryId: 1,
    categoryName: '架构沉思',
    status: 1,
    views: 328,
    createTime: '2026-09-21 14:00',
    updateTime: '2026-09-21 14:00',
  },
  {
    id: 2,
    title: '流体空间重力学：如何打破三列卡片的公式化桎梏',
    summary: '天际线通透保护、核心路标与物性外设的抽屉隐喻分权，以及在现代 Web 中如何借助 SwiftUI 弹簧动力学实现纯粹安定阅读态。',
    categoryId: 2,
    categoryName: '设计工艺',
    status: 1,
    views: 194,
    createTime: '2026-09-20 18:30',
    updateTime: '2026-09-20 18:30',
  },
  {
    id: 3,
    title: 'Spring Boot 模块单体与 Redis 旁路缓存演进手记',
    summary: '从单一应用解耦为业务垂直切片，StringRedisTemplate 强类型防击穿治理与 @RequireRole AOP 声明式鉴权的闭环工程实践。',
    categoryId: 1,
    categoryName: '架构沉思',
    status: 1,
    views: 246,
    createTime: '2026-09-19 21:15',
    updateTime: '2026-09-19 21:15',
  },
]

export function ArticleListPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined)
  const [searchKeyword, setSearchKeyword] = useState('')
  const { isAuthorMode } = useAuthStore()

  // 1. 查询真实文章列表
  const { data: pageData, isLoading } = useArticlePageQuery({
    page: 1,
    size: 20,
    categoryId: selectedCategory,
    keyword: searchKeyword || undefined,
  })

  // 2. 查询全量分类供顶部筛选
  const { data: categories } = useAllCategoriesQuery()

  const realArticles = pageData?.records || []
  const articles = realArticles.length > 0 ? realArticles : STARTER_ARTICLES

  return (
    <div className="space-y-8 max-w-[1120px] mx-auto pb-16">
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

      {/* 搜索与分类过滤胶囊栏 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl soft-glass-panel border border-white/80 shadow-diffuse-sm">
        {/* 分类快捷标签 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(undefined)}
            className={`px-3 py-1 rounded-full text-xs font-zen transition-colors ${
              selectedCategory === undefined
                ? 'bg-stone-900 text-stone-50 font-medium'
                : 'bg-white/60 text-stone-600 hover:bg-white'
            }`}
          >
            全部篇章
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-zen transition-colors ${
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
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="检索篇章标题..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/70 border border-stone-200/60 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
          />
        </div>
      </div>

      {/* 篇章卡卷流 */}
      <div className="space-y-4">
        {articles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            className="p-6 rounded-2xl soft-glass-panel border border-white/80 hover:border-white shadow-diffuse-sm hover:shadow-diffuse-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="washi-seal washi-seal-indigo">
                  {article.categoryName}
                </span>
                <span className="text-stone-400">
                  {article.createTime?.split(' ')[0]}
                </span>
              </div>

              <h3 className="font-zen text-lg sm:text-xl font-bold text-stone-800 hover:text-sky-700 transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 text-xs font-mono text-stone-400 flex-shrink-0">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 5 min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {article.views} 次翻阅
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

export default ArticleListPage
