<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NDataTable,
  NPopconfirm,
  NSpace,
  NTag,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'
import { motion } from 'motion-v'
import { Plus } from 'lucide-vue-next'
import {
  deleteCategory,
  pageQueryCategories,
  type Category,
} from '@/api/category'
import CategoryModal from './components/CategoryModal.vue'

const message = useMessage()

// ============================= 辅助函数 =============================

function formatDateTime(val?: string) {
  if (!val) return '-'
  return val.replace('T', ' ').substring(0, 16)
}

// ============================= 核心状态 =============================

const categoryList = ref<Category[]>([])
const loading = ref(false)

// 弹窗状态
const showModal = ref(false)
const isEdit = ref(false)
const selectedCategory = ref<Category | null>(null)

// 远程服务端分页状态
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  prefix: (info: { itemCount?: number }) => `共 ${info.itemCount ?? 0} 个分类`,
})

// ============================= 表格列配置 =============================

const columns: DataTableColumns<Category> = [
  {
    title: 'ID',
    key: 'id',
    width: 70,
    render(row: Category) {
      return h('span', { class: 'font-mono text-stone-400 text-xs' }, row.id)
    },
  },
  {
    title: '分类名称',
    key: 'name',
    minWidth: 200,
    render(row: Category) {
      return h(
        NTag,
        {
          size: 'small',
          bordered: false,
          type: 'info',
        },
        { default: () => row.name }
      )
    },
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 170,
    render(row: Category) {
      return h('span', { class: 'text-stone-500 font-mono text-xs' }, formatDateTime(row.createdAt))
    },
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 170,
    render(row: Category) {
      return h('span', { class: 'text-stone-500 font-mono text-xs' }, formatDateTime(row.updatedAt))
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 130,
    align: 'right',
    render(row: Category) {
      return h(
        NSpace,
        { justify: 'end', align: 'center', size: 16 },
        () => [
          // 编辑按钮
          h(
            NButton,
            {
              text: true,
              type: 'info',
              size: 'small',
              onClick: () => handleOpenEditModal(row),
            },
            { default: () => '编辑' }
          ),
          // 气泡二次确认删除
          h(
            NPopconfirm,
            {
              positiveText: '确认删除',
              negativeText: '取消',
              onPositiveClick: () => handleDelete(row.id),
            },
            {
              trigger: () =>
                h(
                  NButton,
                  {
                    text: true,
                    type: 'error',
                    size: 'small',
                  },
                  { default: () => '删除' }
                ),
              default: () => `确定删除分类「${row.name}」吗？此操作不可撤销。`,
            }
          ),
        ]
      )
    },
  },
]

// ============================= 接口与数据流 =============================

async function loadCategoryPage() {
  loading.value = true
  try {
    const res = await pageQueryCategories({
      pageNum: paginationReactive.page,
      pageSize: paginationReactive.pageSize,
    })
    categoryList.value = res.records
    paginationReactive.itemCount = res.total
  } catch (error) {
    console.error('加载分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  paginationReactive.page = page
  loadCategoryPage()
}

function handlePageSizeChange(pageSize: number) {
  paginationReactive.pageSize = pageSize
  paginationReactive.page = 1
  loadCategoryPage()
}

function handleOpenCreateModal() {
  isEdit.value = false
  selectedCategory.value = null
  showModal.value = true
}

function handleOpenEditModal(row: Category) {
  isEdit.value = true
  selectedCategory.value = row
  showModal.value = true
}

async function handleDelete(id: number) {
  try {
    await deleteCategory(id)
    message.success('分类已成功删除')
    if (categoryList.value.length === 1 && paginationReactive.page > 1) {
      paginationReactive.page -= 1
    }
    await loadCategoryPage()
  } catch (error) {
    console.error('删除分类失败:', error)
  }
}

onMounted(() => {
  loadCategoryPage()
})
</script>

<template>
  <div class="max-w-6xl mx-auto w-full space-y-8">
    
    <!-- 页面标题与操作头 -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-5 border-b border-black/5">
      <div>
        <div class="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase mb-1">
          01 / CATEGORY TAXONOMY
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-stone-900 leading-snug">
          分类管理
        </h1>
        <p class="text-xs text-stone-500 mt-1">
          “分类如抽屉，给漫无边际的思绪一个安放之所；在此维护全站内容脉络。”
        </p>
      </div>

      <!-- 新建按钮 -->
      <motion.div :while-press="{ scale: 0.96 }">
        <NButton
          type="primary"
          @click="handleOpenCreateModal"
        >
          <template #icon>
            <Plus class="w-4 h-4" />
          </template>
          新建分类
        </NButton>
      </motion.div>
    </div>

    <!-- 表格展示卡片 -->
    <div class="glass-panel rounded-2xl p-6 border border-white/70 shadow-xs">
      <NDataTable
        remote
        :loading="loading"
        :columns="columns"
        :data="categoryList"
        :pagination="paginationReactive"
        :bordered="false"
        :single-line="false"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>

    <!-- 弹窗子组件 (职责自治) -->
    <CategoryModal
      v-model:show="showModal"
      :is-edit="isEdit"
      :category="selectedCategory"
      @success="loadCategoryPage"
    />

  </div>
</template>
