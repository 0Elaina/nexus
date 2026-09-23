import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Tag as TagIcon, ArrowUpRight } from 'lucide-react'
import type { TagVO } from '../types'
import { MOTION_CONFIG } from '@/config/motion'

interface TagVisitorShowcaseProps {
  data?: TagVO[]
  isLoading?: boolean
}

// 丰富的和纸印章色系循环映射
const SEAL_COLOR_CLASSES = [
  'washi-seal-indigo',
  'washi-seal-amber',
  'washi-seal-emerald',
  'washi-seal-sakura',
]

export const TagVisitorShowcase: React.FC<TagVisitorShowcaseProps> = ({
  data = [],
  isLoading,
}) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-12 animate-pulse text-center">
        <div className="h-6 w-36 bg-stone-200/60 rounded-full mx-auto" />
        <div className="h-10 w-64 bg-stone-200/70 rounded-xl mx-auto" />
        <div className="flex flex-wrap justify-center gap-3 pt-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-white/60 rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-12">
      {/* 双语文学卷首 */}
      <div className="text-center space-y-2 max-w-xl mx-auto pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-stone-200/60 text-[11px] font-mono tracking-cold text-emerald-700 shadow-diffuse-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>02 / INDEX · 印章文库</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-zen text-stone-900 tracking-tight">
          手帖印章流云
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 font-zen leading-relaxed">
          每一个细微的主题与灵光，都是串联记忆的温润印戳。点击印章即可检索对应长卷篇章。
        </p>
      </div>

      {/* 和纸印章流云展台 */}
      <div className="p-8 sm:p-12 rounded-3xl soft-glass-panel border border-white/80 shadow-diffuse-md text-center">
        {data.length === 0 ? (
          <div className="py-12 text-stone-400 font-zen text-xs">
            工坊中尚未镌刻任何印章标签
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {data.map((tag, index) => {
              const colorClass = SEAL_COLOR_CLASSES[index % SEAL_COLOR_CLASSES.length]
              return (
                <motion.button
                  key={tag.id}
                  type="button"
                  onClick={() => navigate(`/articles?tagId=${tag.id}`)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: index * 0.03 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
                  className={`group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-mono transition-all shadow-diffuse-sm hover:shadow-diffuse-md apple-haptic washi-seal ${colorClass}`}
                >
                  <TagIcon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="font-semibold">#{tag.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-80 transition-opacity -mr-1" />
                </motion.button>
              )
            })}
          </div>
        )}

        <div className="pt-8 text-stone-400 font-mono text-[11px]">
          共收录 {data.length} 枚灵光印戳 · 贯通全站篇章多维检索
        </div>
      </div>
    </div>
  )
}

export default TagVisitorShowcase
