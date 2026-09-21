import { Outlet } from 'react-router-dom'
import { FloatingNav } from './FloatingNav'
import { ToyDockDrawer } from '@/components/common/ToyDockDrawer'

export function AdminLayout() {
  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* 1. 天际通透跑道微胶囊导航 (FloatingNav) */}
      <FloatingNav />

      {/* 2. 黄金阅读宽幅主展台 */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto pt-20 pb-16 px-4 sm:px-6">
        <Outlet />
      </main>

      {/* 3. 角落折叠物性抽屉 (Toy-Dock：微缩黑胶唱机与时空羁绊) */}
      <ToyDockDrawer />
    </div>
  )
}

export default AdminLayout
