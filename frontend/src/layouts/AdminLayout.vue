<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { motion } from 'motion-v'
import {
  FolderTree,
  FileText,
  Tag,
  MessageSquare,
  Sparkles,
  Layers,
  Activity,
} from 'lucide-vue-next'
import { SIDEBAR_WIDTH, SIDEBAR_OFFSET } from '@/config/layout'

const route = useRoute()
const router = useRouter()
const message = useMessage()

// 当前激活的路由
const currentRouteName = computed(() => (route.name as string) || 'admin-categories')

// 导航菜单配置 (聚焦博客系统核心业务)
const navSections = [
  {
    groupTitle: '内容管理',
    items: [
      {
        name: '分类管理',
        routeName: 'admin-categories',
        icon: FolderTree,
      },
      {
        name: '文章管理',
        routeName: 'admin-articles',
        icon: FileText,
      },
      {
        name: '标签管理',
        routeName: 'admin-tags',
        icon: Tag,
        disabled: true,
        tag: '筹备中',
      },
      {
        name: '评论审核',
        routeName: 'admin-comments',
        icon: MessageSquare,
        disabled: true,
        tag: '筹备中',
      },
    ],
  },
]

function handleNavigate(routeName: string, disabled?: boolean) {
  if (disabled) return
  if (route.name !== routeName) {
    router.push({ name: routeName })
  }
}

// ==================== 站点概况快捷面板 ====================
const isQuickPanelOpen = ref(false)
const quickPanelRef = ref<HTMLElement | null>(null)
const liveTime = ref('')

function updateLiveTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  liveTime.value = `${hours}:${minutes}`
}

let timer: number | null = null

function handleDocumentClick(e: MouseEvent) {
  if (isQuickPanelOpen.value && quickPanelRef.value) {
    if (!quickPanelRef.value.contains(e.target as Node)) {
      isQuickPanelOpen.value = false
    }
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isQuickPanelOpen.value) {
    isQuickPanelOpen.value = false
  }
}

function handleCheckStatus() {
  message.info('博客运行环境良好，可进行文章发布与分类维护。')
  isQuickPanelOpen.value = false
}

onMounted(() => {
  updateLiveTime()
  timer = window.setInterval(updateLiveTime, 10000)
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="min-h-screen w-full relative flex">
    
    <!-- ==================== 1. 悬浮侧栏 (Floating Sidebar Island) ==================== -->
    <aside
      class="fixed top-6 left-6 bottom-6 z-40 flex flex-col justify-between p-5 rounded-2xl glass-panel border border-white/70 shadow-lg"
      :style="{ width: `${SIDEBAR_WIDTH}px` }"
    >
      <div>
        <!-- 品牌标示 -->
        <div class="flex items-center gap-3 px-1 py-2 pb-5 border-b border-black/5">
          <div
            class="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-sm shadow-md font-mono tracking-tighter"
          >
            N
          </div>
          <div>
            <div class="font-bold text-sm text-stone-900 tracking-tight">
              Nexus Admin
            </div>
            <div class="text-xs text-stone-400 mt-0.5 font-sans">
              博客管理控制台
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <div v-for="section in navSections" :key="section.groupTitle" class="mt-6">
          <div class="text-xs font-semibold tracking-wider text-stone-400 px-3 py-1.5 uppercase font-mono">
            {{ section.groupTitle }}
          </div>

          <div class="space-y-1.5 mt-2">
            <template v-for="item in section.items" :key="item.routeName">
              <button
                type="button"
                :disabled="item.disabled"
                @click="handleNavigate(item.routeName, item.disabled)"
                :class="[
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 text-left',
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed text-stone-400'
                    : currentRouteName === item.routeName
                      ? 'bg-white text-stone-900 font-semibold shadow-xs border border-black/5'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                ]"
              >
                <div class="flex items-center gap-3">
                  <component
                    :is="item.icon"
                    class="w-4 h-4"
                    :class="currentRouteName === item.routeName ? 'text-blue-600' : 'opacity-70'"
                  />
                  <span>{{ item.name }}</span>
                </div>

                <span
                  v-if="item.tag"
                  class="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-400 font-sans"
                >
                  {{ item.tag }}
                </span>
                <span
                  v-else-if="currentRouteName === item.routeName"
                  class="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"
                ></span>
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- 侧栏底部：管理员状态与实时时钟 -->
      <div class="p-3.5 bg-white/60 rounded-xl border border-white/70 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold font-mono">
            SA
          </div>
          <div>
            <div class="font-semibold text-xs text-stone-800 leading-tight">Admin</div>
            <div class="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              系统在线
            </div>
          </div>
        </div>
        <span class="text-xs text-stone-400 font-mono">{{ liveTime }}</span>
      </div>
    </aside>

    <!-- ==================== 2. 主内容舞台 (Main Stage) ==================== -->
    <main
      class="flex-1 p-8 lg:p-10 min-h-screen overflow-y-auto"
      :style="{ marginLeft: `${SIDEBAR_WIDTH + SIDEBAR_OFFSET}px` }"
    >
      <RouterView />
    </main>

    <!-- ==================== 3. 站点概况快捷面板 (右下角常驻) ==================== -->
    <div ref="quickPanelRef" class="fixed right-7 bottom-7 z-50">
      <!-- 胶囊触柄 -->
      <motion.button
        type="button"
        class="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/80 shadow-md cursor-pointer select-none text-xs font-medium text-stone-700 hover:text-stone-900 bg-white/85"
        :while-hover="{ y: -2 }"
        :while-press="{ scale: 0.96 }"
        @click="isQuickPanelOpen = !isQuickPanelOpen"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
        <span>站点概况</span>
        <Activity class="w-3.5 h-3.5 text-blue-600 opacity-70" />
      </motion.button>

      <!-- 展开的快捷概况面板 -->
      <motion.div
        v-if="isQuickPanelOpen"
        class="absolute right-0 bottom-12 w-72 p-4 rounded-2xl glass-panel border border-white/90 shadow-2xl bg-white/95 flex flex-col gap-3"
        :initial="{ opacity: 0, y: 12, scale: 0.95 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :transition="{ type: 'spring', stiffness: 400, damping: 28 }"
      >
        <div class="flex items-center justify-between pb-2 border-b border-black/5">
          <div class="flex items-center gap-2 text-xs font-semibold text-stone-800">
            <Layers class="w-3.5 h-3.5 text-blue-600" />
            <span>系统运行概况</span>
          </div>
          <span class="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
            ONLINE
          </span>
        </div>

        <div class="text-xs text-stone-600 leading-relaxed space-y-1">
          <p>博客服务已就绪，分类与文章数据已实时同步。</p>
        </div>

        <motion.button
          type="button"
          class="w-full mt-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200/80 text-stone-700 transition-colors"
          :while-press="{ scale: 0.97 }"
          @click="handleCheckStatus"
        >
          <Sparkles class="w-3.5 h-3.5 text-amber-500" />
          <span>检查系统就绪状态</span>
        </motion.button>
      </motion.div>
    </div>

  </div>
</template>