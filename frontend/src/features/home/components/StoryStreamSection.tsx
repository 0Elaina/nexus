import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Clock, Eye, Calendar, Plus, Edit3, ArrowUpRight } from 'lucide-react'
import { useArticlePageQuery } from '@/features/article/api/articleApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import { MOTION_CONFIG } from '@/config/motion'
import type { ArticleListItemVO } from '@/features/article/types'

// 优雅的默认启幕篇章数据（当后端尚无足够文章时保障画卷视觉丰满）
const DEFAULT_HEADLINE: ArticleListItemVO = {
  id: 1,
  title: 'Nexus 工坊启幕：关于这座数字庭院的物语与工程构想',
  summary: '从 Vue 3 迁移到 React 19，我们彻底推翻了机械表格的枷锁，将二次元物语灵魂、漫画跨页分镜与苹果级微距物理学融为一体，构建出这片具有生活温度的创作场域。',
  categoryId: 1,
  categoryName: '架构沉思',
  status: 1,
  views: 328,
  createTime: '2026-09-21 14:00',
  updateTime: '2026-09-21 14:00',
}

const DEFAULT_CHAPTERS: ArticleListItemVO[] = [
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

export const StoryStreamSection: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthorMode } = useAuthStore()

  // 1. 查询真实后端公开文章
  const { data: pageData } = useArticlePageQuery({ page: 1, size: 6 })
  const realArticles = pageData?.records || []

  // 2. 数据装配：有真实数据优先使用，不足时智能合并启幕范例
  const headlineArticle = realArticles[0] || DEFAULT_HEADLINE
  const subsequentArticles = realArticles.length > 1 ? realArticles.slice(1) : DEFAULT_CHAPTERS

  return (
    <section id="stories" className="py-16 px-6 max-w-[1120px] mx-auto space-y-10">
      {/* 栏目文学双语主标 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/60 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono tracking-cold text-sky-700">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>01 / STORIES · 博文篇章</span>
          </div>
          <h2 className="font-zen text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            写下来的日子与思考
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-zen">
            翻开单行本的彩色跨页，记录架构探幽、前端工匠物理学与生活灵光。
          </p>
        </div>

        {/* 博主工坊操作 */}
        {isAuthorMode && (
          <motion.button
            type="button"
            onClick={() => navigate('/articles')}
            whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>撰写新篇章</span>
          </motion.button>
        )}
      </div>

      {/* 01. 头条漫画跨页分镜大展卡 (Headline Story Spread) */}
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={MOTION_CONFIG.ENTRANCE_TRANSITION}
        whileHover={{ y: -3 }}
        onClick={() => navigate(`/articles`)}
        className="group cursor-pointer relative rounded-2xl overflow-hidden soft-glass-panel border border-white/80 shadow-diffuse-lg transition-all duration-300"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* 左极 7 列：21:9 ~ 16:9 漫画画幅插画 (g4.jpg) */}
          <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-[380px] overflow-hidden bg-stone-900">
            <img
              src="/assets/g4.jpg"
              alt="头条篇章分镜插画"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              onError={(e) => {
                // 优雅降级：纯色物语和纸底
                e.currentTarget.style.display = 'none'
              }}
            />
            {/* 渐变遮罩保护文本 */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent lg:hidden" />
            <div className="absolute top-4 left-4 z-10">
              <span className="washi-seal washi-seal-indigo shadow-md font-zen">
                ★ 卷首头条
              </span>
            </div>
          </div>

          {/* 右极 5 列：杂志排版文学篇章详情 */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-white/70 backdrop-blur-md">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="washi-seal washi-seal-amber font-mono text-[11px]">
                  {headlineArticle.categoryName}
                </span>
                <span className="text-[11px] font-mono text-stone-400">
                  {headlineArticle.createTime?.split(' ')[0]}
                </span>
              </div>

              <h3 className="font-zen text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-sky-700 transition-colors leading-snug">
                {headlineArticle.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed line-clamp-4">
                {headlineArticle.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 5 min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {headlineArticle.views}
                </span>
              </div>

              <div className="flex items-center gap-1 text-stone-700 font-semibold group-hover:translate-x-1 transition-transform">
                <span>阅览详情</span>
                <ArrowUpRight className="w-4 h-4 text-sky-600" />
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {/* 02. 后续篇章 · 错落手帖文卷流 (Chapter River Stream) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subsequentArticles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: index * 0.08 }}
            whileHover={{ y: -3 }}
            onClick={() => navigate('/articles')}
            className="group cursor-pointer p-6 rounded-2xl soft-glass-card border border-white/70 hover:border-white shadow-diffuse-sm hover:shadow-diffuse-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono tracking-cold text-stone-400">
                    0{index + 2} / NOTEBOOK
                  </span>
                  <span className="washi-seal washi-seal-emerald text-[11px]">
                    {article.categoryName}
                  </span>
                </div>
                {isAuthorMode && (
                  <span className="text-[11px] font-mono text-amber-700 hover:text-amber-800 flex items-center gap-0.5">
                    <Edit3 className="w-3 h-3" /> 编辑
                  </span>
                )}
              </div>

              <h4 className="font-zen text-base sm:text-lg font-bold text-stone-800 group-hover:text-sky-700 transition-colors leading-snug">
                {article.title}
              </h4>

              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {article.createTime?.split(' ')[0]}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {article.views} 次翻阅
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
