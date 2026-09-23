import React, { useState } from 'react'
import { DawnHeroStage } from '../components/DawnHeroStage'
import { StoryStreamSection } from '../components/StoryStreamSection'
import { CategoryFolioShowcase } from '../components/CategoryFolioShowcase'
import { AuthorLoginModal } from '@/features/auth/components/AuthorLoginModal'
import { useBloggerProfileQuery } from '@/features/user/api/userApi'
import { useSiteStatsQuery } from '@/features/site/api/siteApi'
import { Feather, Mail } from 'lucide-react'

export const HomePage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { data: blogger } = useBloggerProfileQuery()
  const { data: stats } = useSiteStatsQuery()

  const handleScrollToStories = () => {
    const el = document.getElementById('stories')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToFolios = () => {
    const el = document.getElementById('folios')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-12 pb-24">
      {/* 01. 晨曦启幕首屏 (The Dawn Hero Stage) */}
      <DawnHeroStage
        onScrollToStories={handleScrollToStories}
        onScrollToFolios={handleScrollToFolios}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* 02. 博文篇章画卷 (The Story Stream) */}
      <StoryStreamSection />

      {/* 03. 和纸文库书匣 (The Category Folio Showcase) */}
      <CategoryFolioShowcase />

      {/* 04. 页尾物语留白与落款 (Atelier Colophon) */}
      <footer className="pt-20 pb-12 text-center text-xs text-stone-400 font-mono space-y-3 border-t border-stone-200/40 max-w-[1120px] mx-auto px-6">
        <div className="flex items-center justify-center gap-1.5 font-zen text-stone-600 font-medium">
          <Feather className="w-3.5 h-3.5 text-amber-500" />
          <span>{blogger?.nickname || 'Nexus'} 个人博客 · 写在晨曦与夜空之间的日子</span>
        </div>

        {/* 动态宏观指标与博主联系方式 */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-stone-400 font-mono">
          <span>累计翻阅 {stats?.totalViewCount ?? 0} 次</span>
          <span>·</span>
          <span>沉淀 {stats?.articleCount ?? 0} 篇章</span>
          <span>·</span>
          <span>{stats?.tagCount ?? 0} 枚印章</span>
          {blogger?.email && (
            <>
              <span>·</span>
              <a
                href={`mailto:${blogger.email}`}
                className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span>{blogger.email}</span>
              </a>
            </>
          )}
        </div>

        <div className="text-[11px] text-stone-400 font-sans pt-1">
          React 19 · Vite 6 · Tailwind CSS v4 · Spring Boot Modular Monolith
        </div>
      </footer>

      {/* 博主登入弹窗 */}
      <AuthorLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  )
}

export default HomePage
