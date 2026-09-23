import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Lock, User, KeyRound } from 'lucide-react'
import request from '@/lib/api-client'
import { useAuthStore } from '../store/authStore'

interface AuthorLoginModalProps {
  open?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
}

export function AuthorLoginModal({ open, isOpen, onOpenChange, onClose }: AuthorLoginModalProps) {
  const isModalOpen = open ?? isOpen ?? false
  const handleOpenChange = (newVal: boolean) => {
    onOpenChange?.(newVal)
    if (!newVal) {
      onClose?.()
    }
  }
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setToken = useAuthStore((s) => s.setToken)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      toast.error('请输入用户名与密码')
      return
    }

    setIsLoading(true)
    try {
      const res = await request<{ token: string; username?: string }>({
        url: '/auth/login',
        method: 'POST',
        data: { username: username.trim(), password: password.trim() },
      })

      // 健壮解析：无论后端返回纯字符串还是 LoginResultVO 对象，均安全提取真实的 token 字符串
      const realToken = typeof res === 'string' ? res : res?.token
      const realUsername = (typeof res === 'object' && res?.username) || username.trim()

      if (!realToken) {
        throw new Error('未获取到有效认证令牌')
      }

      setToken(realToken, realUsername)
      toast.success('博主身份核验成功，已解锁创作工坊！')
      handleOpenChange(false)
      setPassword('')
    } catch (err: unknown) {
      // api-client 会自动弹出后端错误消息
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-100 p-6 rounded-card border border-white/80 bg-white/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="pb-2">
          <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center mb-2 shadow-xs">
            <KeyRound className="w-5 h-5 text-accent-amber" />
          </div>
          <DialogTitle className="text-base font-bold font-zen text-stone-900">
            博主身份认证
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500 font-sans">
            输入账号密码，即刻解锁博客创作工坊与分类管理权限。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 font-zen flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>管理账号</span>
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入管理员用户名"
              disabled={isLoading}
              className="h-10 rounded-control bg-stone-50/70 border-stone-200 text-xs font-sans text-stone-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 font-zen flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>访问凭证 (密码)</span>
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              disabled={isLoading}
              className="h-10 rounded-control bg-stone-50/70 border-stone-200 text-xs font-sans text-stone-900"
            />
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 rounded-control text-xs text-stone-600 border-stone-200 hover:bg-stone-100 apple-haptic"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-9 px-5 rounded-control text-xs bg-stone-900 hover:bg-stone-800 text-white font-medium shadow-sm apple-haptic"
            >
              {isLoading ? '核验中...' : '认证登入'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
