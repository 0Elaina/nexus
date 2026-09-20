<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NEmpty,
  NInput,
  NPagination,
  NSelect,
  NSpin,
  NTag,
  useMessage,
  type SelectOption,
} from 'naive-ui'
import { motion } from 'motion-v'
import {
  Calendar,
  Eye,
  Plus,
  RotateCcw,
  Search,
} from 'lucide-vue-next'
import { adminPageQueryArticles, type ArticleListItem } from '@/api/article'
import { getAllCategories, type Category } from '@/api/category'

const message = useMessage()

// ============================= 核心状态 =============================

const loading = ref(false)
const articleList = ref<ArticleListItem[]>([])
const categoryList = ref<Category[]>([])

// 检索过滤条件
const filterForm = reactive({
  keyword: '',
  categoryId: null as number | null,
  status: null as number | null,
})

// 状态下拉选项
const statusOptions: SelectOption[] = [
  { label: '已发布', value: 1 },
  { label: '草稿', value: 0 },
]

// 分页状态 (网格排版适合 9 篇/页，即 3x3 矩阵)
const pagination = reactive({
  page: 1,
  pageSize: 9,
  itemCount: 0,
})

// 分类下拉选项 (严格满足 Naive UI 的 SelectOption 契约)
const categoryOptions = computed<SelectOption[]>(() =>
  categoryList.value.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }))
)

// 分类 ID 到名称的映射字典
const categoryMap = computed(() => {
  const map: Record<string, string> = {}
  categoryList.value.forEach((c) => {
    map[String(c.id)] = c.name
  })
  return map
})

// ============================= 辅助函数 =============================

function formatDateTime(val?: string) {
  if (!val) return '-'
  return val.replace('T', ' ').substring(0, 16)
}

function getCategoryName(id: string) {
  return categoryMap.value[id] || '默认分类'
}

// ============================= 数据加载 =============================

async function loadCategories() {
  try {
    categoryList.value = await getAllCategories()
  } catch (error) {
    console.error('加载分类列表失败:', error)
  }
}

async function loadArticles() {
  loading.value = true
  try {
    const res = await adminPageQueryArticles({
      pageNum: pagination.page,
      pageSize: pagination.pageSize,
      keyword: filterForm.keyword.trim() || undefined,
      categoryId: filterForm.categoryId ?? undefined,
      status: filterForm.status ?? undefined,
    })
    articleList.value = res.records
    pagination.itemCount = res.total
  } catch (error) {
    console.error('加载文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  loadArticles()
}

function handleReset() {
  filterForm.keyword = ''
  filterForm.categoryId = null
  filterForm.status = null
  pagination.page = 1
  loadArticles()
}

function handlePageChange(page: number) {
  pagination.page = page
  loadArticles()
}

function handleCreateArticle() {
  message.info('文章撰写与 Markdown 编辑器待后端新建接口就绪后开放。')
}

function handleArticleAction(article: ArticleListItem) {
  message.info(`文章「${article.title}」的详情与编辑待后续接口就绪后开放。`)
}

onMounted(async () => {
  await loadCategories()
  await loadArticles()
})
</script>

<template>
  <div class="max-w-6xl mx-auto w-full space-y-8">
    
    <!-- 页面标题与操作头 (复刻 articles.html 原型双语排版，去技术化文案) -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-5 border-b border-black/5">
      <div>
        <div class="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase mb-1">
          02 / MANUSCRIPT DOCK
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-stone-900 leading-snug">
          文章管理
        </h1>
        <p class="text-xs text-stone-500 mt-1">
          “字句如露水，在晨光微曦中凝结成文；在此审阅与调度全站文稿资产。”
        </p>
      </div>

      <!-- 新建文章按钮 -->
      <motion.div :while-press="{ scale: 0.96 }">
        <NButton
          type="primary"
          @click="handleCreateArticle"
        >
          <template #icon>
            <Plus class="w-4 h-4" />
          </template>
          新建文章
        </NButton>
      </motion.div>
    </div>

    <!-- 筛选过滤顶栏 (整合搜索、分类下拉、重置) -->
    <div class="glass-panel rounded-2xl p-4 border border-white/70 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3 flex-1 min-w-70">
        <!-- 关键词模糊检索 -->
        <div class="w-64">
          <NInput
            v-model:value="filterForm.keyword"
            placeholder="搜索文章标题或摘要..."
            clearable
            @keydown.enter="handleSearch"
          >
            <template #prefix>
              <Search class="w-3.5 h-3.5 text-stone-400 mr-1" />
            </template>
          </NInput>
        </div>

        <!-- 分类选择下拉 -->
        <div class="w-44">
          <NSelect
            v-model:value="filterForm.categoryId"
            :options="categoryOptions"
            placeholder="按分类筛选"
            clearable
            @update:value="handleSearch"
          />
        </div>

        <!-- 状态选择下拉 -->
        <div class="w-36">
          <NSelect
            v-model:value="filterForm.status"
            :options="statusOptions"
            placeholder="全部状态"
            clearable
            @update:value="handleSearch"
          />
        </div>

        <NButton secondary @click="handleSearch">
          查询
        </NButton>

        <NButton text class="text-stone-500 hover:text-stone-800" @click="handleReset">
          <template #icon>
            <RotateCcw class="w-3.5 h-3.5" />
          </template>
          重置
        </NButton>
      </div>

      <div class="text-xs text-stone-400 font-mono">
        共检索到 {{ pagination.itemCount }} 篇文章
      </div>
    </div>

    <!-- 漫画分镜非对称卡片流 (Storyboard Flow) -->
    <NSpin :show="loading">
      <div v-if="articleList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-for="(article, index) in articleList" :key="article.id">
          
          <!-- 焦点头条卡片 (第一页首项：双列贯通 Hero Card 构图) -->
          <div
            v-if="index === 0 && pagination.page === 1"
            class="md:col-span-2 lg:col-span-2 glass-panel rounded-2xl p-7 flex flex-col justify-between border border-white/70 shadow-sm hover:shadow-md transition-all duration-300 relative group"
          >
            <div>
              <div class="flex items-center gap-2.5 mb-3">
                <NTag size="small" :bordered="false" type="info">
                  🏷️ {{ getCategoryName(article.categoryId) }}
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
                <NButton size="small" secondary @click="handleArticleAction(article)">
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
                  🏷️ {{ getCategoryName(article.categoryId) }}
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

              <NButton text type="info" size="small" @click="handleArticleAction(article)">
                阅览
              </NButton>
            </div>
          </div>

        </template>
      </div>

      <!-- 空数据状态 -->
      <div
        v-else-if="!loading"
        class="glass-panel rounded-2xl p-16 text-center border border-white/70 shadow-sm"
      >
        <NEmpty description="未检索到符合条件的文章文稿">
          <template #icon>
            <BookOpen class="w-10 h-10 text-stone-300 mx-auto" />
          </template>
          <template #extra>
            <NButton secondary size="small" class="mt-2" @click="handleReset">
              清空搜索条件
            </NButton>
          </template>
        </NEmpty>
      </div>
    </NSpin>

    <!-- 底部分页栏 (拥有独立底栏呼吸感) -->
    <div
      v-if="pagination.itemCount > 0"
      class="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between border border-white/70 shadow-xs"
    >
      <div class="text-xs text-stone-500 font-sans">
        共 <strong class="text-stone-800">{{ pagination.itemCount }}</strong> 篇文章
      </div>

      <NPagination
        v-model:page="pagination.page"
        :page-size="pagination.pageSize"
        :item-count="pagination.itemCount"
        @update:page="handlePageChange"
      />
    </div>

  </div>
</template>
