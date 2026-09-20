<script setup lang="ts">
import { NButton, NTag } from 'naive-ui'
import { Calendar, Eye } from 'lucide-vue-next'
import type { ArticleListItem } from '@/api/article'

const props = withDefaults(
  defineProps<{
    article: ArticleListItem
    isHero?: boolean
    categoryName?: string
  }>(),
  {
    isHero: false,
    categoryName: '默认分类',
  }
)

const emit = defineEmits<{
  (e: 'action', article: ArticleListItem): void
}>()

function formatDateTime(val?: string) {
  if (!val) return '-'
  return val.replace('T', ' ').substring(0, 16)
}
</script>

<template>
  <!-- 焦点头条卡片 (第一页首项：双列贯通 Hero Card 构图) -->
  <div
    v-if="isHero"
    class="md:col-span-2 lg:col-span-2 glass-panel rounded-2xl p-7 flex flex-col justify-between border border-white/70 shadow-sm hover:shadow-md transition-all duration-300 relative group"
  >
    <div>
      <div class="flex items-center gap-2.5 mb-3">
        <NTag size="small" :bordered="false" type="info">
          🏷️ {{ categoryName }}
        </NTag>
        <span
          v-if="article.status === 1"
          class="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          已发布
        </span>
        <span
          v-else
          class="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
          草稿
        </span>
        <span class="font-mono text-xs text-stone-400 ml-auto">
          {{ formatDateTime(article.createdAt) }}
        </span>
      </div>

      <h2 class="text-xl font-bold text-stone-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
        {{ article.title }}
      </h2>

      <p class="text-xs text-stone-500 line-clamp-3 mt-2.5 leading-relaxed">
        {{ article.summary || '暂无文稿摘要，点击进入详情查看正文内容...' }}
      </p>
    </div>

    <div class="pt-5 mt-6 border-t border-black/5 flex items-center justify-between">
      <div class="flex items-center gap-4 text-xs text-stone-400 font-mono">
        <span class="flex items-center gap-1.5">
          <Eye class="w-3.5 h-3.5 text-stone-400" />
          {{ article.viewCount }} 次阅读
        </span>
      </div>

      <div class="flex items-center gap-2">
        <NButton size="small" secondary @click="emit('action', article)">
          查看详情
        </NButton>
      </div>
    </div>
  </div>

  <!-- 常规分镜卡片 -->
  <div
    v-else
    class="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/70 shadow-sm hover:shadow-md transition-all duration-300 h-64 group"
  >
    <div>
      <div class="flex items-center justify-between mb-3">
        <NTag size="small" :bordered="false" type="info">
          🏷️ {{ categoryName }}
        </NTag>
        <span
          v-if="article.status === 1"
          class="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium"
        >
          已发布
        </span>
        <span
          v-else
          class="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium"
        >
          草稿
        </span>
      </div>

      <h3 class="text-base font-bold text-stone-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
        {{ article.title }}
      </h3>

      <p class="text-xs text-stone-500 line-clamp-3 mt-2 leading-relaxed">
        {{ article.summary || '暂无文稿摘要描述...' }}
      </p>
    </div>

    <div class="pt-4 border-t border-black/5 flex items-center justify-between text-xs">
      <div class="flex items-center gap-3 text-stone-400 font-mono text-[11px]">
        <span class="flex items-center gap-1">
          <Eye class="w-3 h-3" />
          {{ article.viewCount }}
        </span>
        <span class="flex items-center gap-1">
          <Calendar class="w-3 h-3" />
          {{ formatDateTime(article.createdAt).substring(5) }}
        </span>
      </div>

      <NButton text type="info" size="small" @click="emit('action', article)">
        阅览
      </NButton>
    </div>
  </div>
</template>
