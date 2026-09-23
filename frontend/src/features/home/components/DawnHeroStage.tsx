import React from 'react'
import { motion } from 'motion/react'
import { ArrowDown, Sparkles, BookOpen, Compass, Feather } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useBloggerProfileQuery } from '@/features/user/api/userApi'
import { useSiteStatsQuery } from '@/features/site/api/siteApi'
import { MOTION_CONFIG } from '@/config/motion'

interface DawnHeroStageProps {
  onScrollToStories: () => void
  onScrollToFolios: () => void
  onOpenLogin: () => void
}

export const DawnHeroStage: React.FC<DawnHeroStageProps> = ({
  onScrollToStories,
  onScrollToFolios,
  onOpenLogin,
}) => {
  const { isAuthenticated, isAuthorMode, toggleAuthorMode } = useAuthStore()
  const { data: blogger } = useBloggerProfileQuery()
  const { data: stats } = useSiteStatsQuery()

  return (
    <section className="relative min-h-[86vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center select-none">
      {/* 晨曦漫射天光柔晕 (Atmospheric Light Core) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-170 h-115 bg-linear-to-b from-sky-200/40 via-amber-100/30 to-transparent blur-3xl rounded-full -z-10"
      />

      {/* 01. 博主人物印章徽记 (Blogger Avatar Stamp with Soft Neumorphic Glass) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={MOTION_CONFIG.ENTRANCE_TRANSITION}
        className="relative group mb-6"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 soft-glass-panel shadow-diffuse-md">
          <div className="w-full h-full rounded-full overflow-hidden bg-white/90 border border-white/80 relative">
            <img
              src={blogger?.avatar || '/assets/g12.jpg'}
              alt={blogger?.nickname ? `${blogger.nickname}的印章` : '博主印章'}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                // 优雅降级：若用户尚未配置图片，呈递柔和和纸图腾
                e.currentTarget.style.display = 'none'
              }}
            />
            {/* 降级备用纯粹和纸徽记 */}
            <div className="w-full h-full flex items-center justify-center bg-linear-to-tr from-sky-50 to-amber-50 text-stone-600 font-zen font-bold text-2xl">
              {blogger?.nickname ? blogger.nickname[0].toUpperCase() : 'N'}
            </div>
          </div>
        </div>

        {/* 呼吸状态小光标 */}
        <div
          className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center"
          title="站点运行中 · 在线"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </div>
      </motion.div>

      {/* 02. 文学双语字阶对位 (Bilingual Counterpoint Structure) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: 0.1 }}
        className="space-y-3 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-stone-200/60 shadow-diffuse-sm text-[11px] font-mono tracking-cold text-stone-600">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>
            00 / PROLOGUE · {blogger?.nickname ? `${blogger.nickname} 的手帖序幕` : '序幕'}
          </span>
        </div>

        <h1 className="font-zen text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight text-glow-soft">
          写在晨曦与夜空之间的日子
        </h1>

        <p className="font-zen text-sm sm:text-base text-stone-600 leading-relaxed max-w-lg mx-auto">
          「愿每一个敲下的字符，都能在晨光里找到栖息的手帖。」
        </p>
      </motion.div>

      {/* 03. 生活温度与全站宏观数据状态行 (Living Status & Stats Line) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: 0.2 }}
        className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 px-4 py-2 rounded-full soft-glass-card text-xs text-stone-600 font-mono shadow-diffuse-sm"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-rose-400">🌸</span> sakura: drifting
        </span>
        <span className="text-stone-300">·</span>
        <span className="flex items-center gap-1.5 text-stone-700">
          <span className="text-amber-500">📖</span> {stats?.articleCount ?? 0} 篇章
        </span>
        <span className="text-stone-300">·</span>
        <span className="flex items-center gap-1.5 text-stone-700">
          <span className="text-emerald-500">🏷️</span> {stats?.tagCount ?? 0} 印章
        </span>
        <span className="text-stone-300">·</span>
        <span className="flex items-center gap-1.5 font-semibold text-sky-600">
          <span className="text-sky-500">👁️</span> {stats?.totalViewCount ?? 0} 次翻阅
        </span>
        <span className="text-stone-300">·</span>
        <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
          <span className="text-emerald-500">🛰️</span> nexus: online
        </span>
      </motion.div>

      {/* 04. 导向微距触点群 (Action Triggers) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION_CONFIG.ENTRANCE_TRANSITION, delay: 0.28 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3.5"
      >
        <motion.button
          type="button"
          onClick={onScrollToStories}
          whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-stone-50 text-xs sm:text-sm font-medium shadow-md hover:bg-stone-800 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>翻阅博文篇章</span>
          <ArrowDown className="w-3.5 h-3.5 opacity-60" />
        </motion.button>

        <motion.button
          type="button"
          onClick={onScrollToFolios}
          whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full soft-glass-panel text-stone-700 text-xs sm:text-sm font-medium hover:bg-white transition-colors"
        >
          <Compass className="w-4 h-4 text-sky-600" />
          <span>探索手帖文库</span>
        </motion.button>

        {/* 博主身份专用就地创作入口 */}
        {isAuthenticated ? (
          <motion.button
            type="button"
            onClick={toggleAuthorMode}
            whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium border transition-colors ${
              isAuthorMode
                ? 'bg-amber-100/80 border-amber-300 text-amber-900 shadow-sm'
                : 'bg-white/50 border-stone-200 text-stone-600 hover:bg-white'
            }`}
          >
            <Feather className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAuthorMode ? '当前：工坊创作态' : '切至：工坊创作态'}</span>
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={onOpenLogin}
            whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            <Feather className="w-3.5 h-3.5 opacity-60" />
            <span>博主登入</span>
          </motion.button>
        )}
      </motion.div>
    </section>
  )
}

export default DawnHeroStage
