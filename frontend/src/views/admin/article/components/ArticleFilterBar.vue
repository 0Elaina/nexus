<script setup lang="ts">
import { NButton, NInput, NSelect, type SelectOption } from 'naive-ui'
import { RotateCcw, Search } from 'lucide-vue-next'

const props = defineProps<{
  keyword: string
  categoryId: number | null
  status: number | null
  total: number
  categoryOptions: SelectOption[]
  statusOptions: SelectOption[]
}>()

const emit = defineEmits<{
  (e: 'update:keyword', val: string): void
  (e: 'update:categoryId', val: number | null): void
  (e: 'update:status', val: number | null): void
  (e: 'search'): void
  (e: 'reset'): void
}>()
</script>

<template>
  <div class="glass-panel rounded-2xl p-4 border border-white/70 shadow-xs flex flex-wrap items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-3 flex-1 min-w-70">
      <!-- 关键词模糊检索 -->
      <div class="w-64">
        <NInput
          :value="keyword"
          placeholder="搜索文章标题或摘要..."
          clearable
          @update:value="(val) => emit('update:keyword', val)"
          @keydown.enter="emit('search')"
        >
          <template #prefix>
            <Search class="w-3.5 h-3.5 text-stone-400 mr-1" />
          </template>
        </NInput>
      </div>

      <!-- 分类选择下拉 -->
      <div class="w-44">
        <NSelect
          :value="categoryId"
          :options="categoryOptions"
          placeholder="按分类筛选"
          clearable
          @update:value="(val) => { emit('update:categoryId', val); emit('search') }"
        />
      </div>

      <!-- 状态选择下拉 -->
      <div class="w-36">
        <NSelect
          :value="status"
          :options="statusOptions"
          placeholder="全部状态"
          clearable
          @update:value="(val) => { emit('update:status', val); emit('search') }"
        />
      </div>

      <NButton secondary @click="emit('search')">
        查询
      </NButton>

      <NButton text class="text-stone-500 hover:text-stone-800" @click="emit('reset')">
        <template #icon>
          <RotateCcw class="w-3.5 h-3.5" />
        </template>
        重置
      </NButton>
    </div>

    <div class="text-xs text-stone-400 font-mono">
      共检索到 {{ total }} 篇文章
    </div>
  </div>
</template>
