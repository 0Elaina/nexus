import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Sparkles, FolderTree, FileText, KeyRound, LogOut, Eye, Wrench } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { AuthorLoginModal } from '@/features/auth/components/AuthorLoginModal'
import { useLogoutMutation } from '@/features/auth/api/authApi'
import { MOTION_CONFIG } from '@/config/motion'
import { toast } from 'sonner'

export function FloatingNav() {
  const location = useLocation()
  const [liveTime, setLiveTime] = useState('')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const { token, isAuthorMode, toggleAuthorMode } = useAuthStore()
  const isAuthenticated = Boolean(token)
  const logoutMutation = useLogoutMutation()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setLiveTime(`${hours}:${minutes}`)
    }
    updateTime()
    const timer = window.setInterval(updateTime, 10000)
    return () => clearInterval(timer)
  }, [])

  const navItems = [
    {
      name: '首页画卷',
      path: '/',
      icon: Sparkles,
      exact: true,
    },
    {
      name: '博文篇章',
      path: '/articles',
      icon: FileText,
      exact: false,
    },
    {
      name: isAuthenticated && isAuthorMode ? '手帖工坊' : '手帖文库',
      path: '/categories',
      icon: FolderTree,
      exact: false,
    },
  ]

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast.info('已安全注销并退出工坊，回到纯净访客视点')
    } catch {
      toast.info('已退出工坊模式')
    }
  }

  return (
    <>
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-auto select-none">
        <nav className="flex items-center gap-2 p-1.5 pr-3 rounded-full soft-glass-panel border border-white/80 shadow-diffuse-md">
          {/* 品牌标识印章 */}
          <Link
            to="/"
            className="flex items-center gap-2.5 pl-2 pr-2.5 py-1 rounded-full hover:bg-white/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              N
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold font-zen text-stone-900 tracking-tight leading-tight">
                Nexus
              </span>
              <span className="text-[9px] text-stone-400 font-sans leading-none">
                {isAuthenticated && isAuthorMode ? '创作工坊' : '个人博客'}
              </span>
            </div>
          </Link>

          {/* 竖向高光分割线 */}
          <div className="w-[1px] h-4 bg-black/10"></div>

          {/* 分段式微距导航 (Segmented Switcher) */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path)
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isActive ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-xs border border-black/5"
                      transition={MOTION_CONFIG.SPRING_SNAPPY}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5 font-zen">
                    <Icon
                      className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'opacity-70'}`}
                    />
                    <span>{item.name}</span>
                  </span>
                </Link>
              )
            })}
          </div>

          {/* 竖向高光分割线 */}
          <div className="w-[1px] h-4 bg-black/10"></div>

          {/* 右侧：身份感知与操作区 */}
          <div className="flex items-center gap-2 pl-1">
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                {/* 视点切换微胶囊：工坊模式 <-> 访客预览 */}
                <button
                  type="button"
                  onClick={toggleAuthorMode}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-zen font-medium transition-all apple-haptic ${
                    isAuthorMode
                      ? 'bg-accent-emerald-soft text-accent-emerald border border-accent-emerald/20'
                      : 'bg-accent-amber-soft text-accent-amber border border-accent-amber/25'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isAuthorMode ? 'bg-accent-emerald animate-pulse' : 'bg-accent-amber'
                    }`}
                  ></span>
                  <span>{isAuthorMode ? '工坊管理中' : '访客预览态'}</span>
                  {isAuthorMode ? <Wrench className="w-3 h-3 ml-0.5" /> : <Eye className="w-3 h-3 ml-0.5" />}
                </button>

                {/* 登出触点 */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="退出博主登入"
                  className="p-1.5 rounded-full hover:bg-stone-100/80 text-stone-400 hover:text-rose-600 transition-colors apple-haptic"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* 实时时钟 */}
                <span className="font-mono-code text-[11px] text-stone-400">{liveTime}</span>

                {/* 访客端：极轻量博主登入钥匙 */}
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-zen font-medium text-stone-600 hover:text-stone-900 hover:bg-white/80 transition-all apple-haptic border border-black/5"
                >
                  <KeyRound className="w-3 h-3 text-accent-amber" />
                  <span>博主登入</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* 博主登入弹窗 */}
      <AuthorLoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  )
}
export default FloatingNav
