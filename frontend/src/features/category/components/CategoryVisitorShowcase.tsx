import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { FileText, ArrowUpRight, Compass, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { CategoryVO, PageResult } from '../types'

interface CategoryVisitorShowcaseProps {
  data?: PageResult<CategoryVO> | CategoryVO[]
  isLoading: boolean
}

export function CategoryVisitorShowcase({ data, isLoading }: CategoryVisitorShowcaseProps) {
  const records = Array.isArray(data) ? data : data?.records || []
  const total = Array.isArray(data) ? data.length : data?.total || 0

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 访客端大标题与引导文案 */}
      <div className="text-center space-y-2 max-w-xl mx-auto pt-4 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-black/5 text-[11px] font-mono-code text-stone-500 shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-accent-indigo" />
          <span>01 / TAXONOMY EXPLORATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-zen text-stone-900 tracking-tight">
          分类探索
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
          收纳归整博文主题脉络与知识切片，点击探索每一处笔墨归宿。
        </p>
      </div>

      {/* 2~3 列错落微距手帖卡片画卷 (Folio Showcase) */}
      {isLoading ? (
        <div className="h-64 rounded-2xl soft-glass-panel flex flex-col items-center justify-center gap-3 text-stone-400 text-xs">
          <span className="w-3 h-3 rounded-full bg-sky-500 animate-ping"></span>
          <span className="font-zen">正在翻阅分类手帖...</span>
        </div>
      ) : records.length === 0 ? (
        <div className="h-64 rounded-2xl soft-glass-panel flex flex-col items-center justify-center gap-2 text-stone-400 text-xs text-center p-6">
          <p className="font-zen text-sm text-stone-600">暂无公开分类</p>
          <p className="font-sans text-stone-400">博主尚未发布任何主题分类，敬请期待。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {records.map((category, index) => {
            const displayIndex = String(index + 1).padStart(2, '0')

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/articles?category=${category.id}`}
                  className="group block p-6 rounded-2xl soft-glass-panel border border-white/80 hover:border-white shadow-diffuse-sm hover:shadow-diffuse-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-4">
                    <span className="font-mono-code text-xs font-bold text-stone-300 group-hover:text-accent-indigo transition-colors">
                      {displayIndex}
                    </span>

                    <Badge variant="washiIndigo" className="font-zen px-2.5 py-0.5">
                      <FileText className="w-3 h-3 mr-1 text-accent-indigo" />
                      <span>{category.articleCount ?? 0} 篇</span>
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold font-zen text-stone-900 group-hover:text-accent-indigo transition-colors tracking-tight">
                      {category.name}
                    </h3>
                    <div className="inline-block px-2 py-0.5 rounded-md bg-stone-100/90 text-stone-500 font-mono text-xs border border-stone-200/50">
                      #{category.slug || `cat-${category.id}`}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/[0.04] flex items-center justify-between text-xs text-stone-400 group-hover:text-stone-700 transition-colors">
                    <span className="font-zen text-[11px]">探索收录博文</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* 底部探索脚注 */}
      <div className="text-center pt-6">
        <span className="text-xs text-stone-400 font-sans">
          共收录 <span className="font-mono-code font-semibold text-stone-600">{total}</span> 个知识主题分类
        </span>
      </div>
    </div>
  )
}
