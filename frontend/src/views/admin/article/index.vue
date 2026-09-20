<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NEmpty,
  NPagination,
  NSpin,
  useMessage,
  type SelectOption,
} from 'naive-ui'
import { motion } from 'motion-v'
import { BookOpen, Plus } from 'lucide-vue-next'
import { adminPageQueryArticles, type ArticleListItem } from '@/api/article'
import { getAllCategories, type Category } from '@/api/category'
import ArticleFilterBar from './components/ArticleFilterBar.vue'
import ArticleCard from './components/ArticleCard.vue'
import ArticleCreateModal from './components/ArticleCreateModal.vue'

const message = useMessage()

// ============================= 核心状态 =============================

const loading = ref(false)
const articleList = ref<ArticleListItem[]>([])
const categoryList = ref<Category[]>([])
const showCreateModal = ref(false)

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
          @click="showCreateModal = true"
        >
          <template #icon>
            <Plus class="w-4 h-4" />
          </template>
          新建文章
        </NButton>
      </motion.div>
    </div>

    <!-- 筛选过滤顶栏 (子组件自治) -->
    <ArticleFilterBar
      v-model:keyword="filterForm.keyword"
      v-model:category-id="filterForm.categoryId"
      v-model:status="filterForm.status"
      :total="pagination.itemCount"
      :category-options="categoryOptions"
      :status-options="statusOptions"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 漫画分镜非对称卡片流 (子组件自治) -->
    <NSpin :show="loading">
      <div v-if="articleList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-for="(article, index) in articleList" :key="article.id">
          <ArticleCard
            :article="article"
            :is-hero="index === 0 && pagination.page === 1"
            :category-name="getCategoryName(article.categoryId)"
            @action="handleArticleAction"
          />
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

    <!-- 新建文章弹窗 (子组件自治) -->
    <ArticleCreateModal
      v-model:show="showCreateModal"
      :category-options="categoryOptions"
      :default-category-id="categoryList.length > 0 ? (categoryList[0].id as number) : null"
      @success="handleSearch"
    />

  </div>
</template>
