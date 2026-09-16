<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NMenu,
  type MenuOption,
} from 'naive-ui'
import { SIDEBAR_WIDTH } from '@/config/layout'

const route = useRoute()
const router = useRouter()

// 当前激活的菜单项 key
const activeKey = computed(() => (route.name as string) || 'admin-categories')

// 后台菜单项定义 (对接 Linear/Vercel 原型规范)
const menuOptions: MenuOption[] = [
  {
    type: 'group',
    label: '内容中心',
    key: 'group-content',
    children: [
      {
        label: '分类管理',
        key: 'admin-categories',
      },
      {
        label: '文章管理 (开发中)',
        key: 'admin-articles',
        disabled: true,
      },
      {
        label: '标签管理 (开发中)',
        key: 'admin-tags',
        disabled: true,
      },
    ],
  },
]

/**
 * 菜单项点击路由跳转
 */
function handleMenuSelect(key: string) {
  if (key !== route.name) {
    router.push({ name: key })
  }
}
</script>

<template>
  <NLayout has-sider class="h-screen w-screen overflow-hidden">
    <!-- 侧边栏 Sider -->
    <NLayoutSider
      :width="SIDEBAR_WIDTH"
      bordered
      content-class="flex flex-col justify-between h-full p-4"
    >
      <div class="space-y-6">
        <!-- Brand Logo 品牌标识 -->
        <div class="flex items-center gap-3 px-2 py-1">
          <div class="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shadow-xs font-mono">
            N
          </div>
          <div>
            <div class="font-bold text-sm text-zinc-900 tracking-tight leading-none">
              Nexus Admin
            </div>
            <div class="text-[11px] text-zinc-400 mt-1">
              控制台与内容管理
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <NMenu
          :value="activeKey"
          :options="menuOptions"
          @update:value="handleMenuSelect"
        />
      </div>

      <!-- 底部管理员状态卡片 -->
      <div class="pt-3 border-t border-zinc-100 flex items-center justify-between px-2">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-xs font-bold font-mono">
            SA
          </div>
          <div class="text-xs">
            <div class="font-semibold text-zinc-800 leading-tight">Admin</div>
            <div class="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              系统在线
            </div>
          </div>
        </div>
        <span class="text-zinc-400 text-xs font-mono" title="系统版本">v0.0.1</span>
      </div>
    </NLayoutSider>

    <!-- 右侧内容主视口 (宏观内边距留白) -->
    <NLayoutContent class="p-8 overflow-y-auto min-h-screen">
      <RouterView />
    </NLayoutContent>
  </NLayout>
</template>