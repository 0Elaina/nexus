<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NPopconfirm,
  NSpace,
  NTag,
  useMessage,
  type DataTableColumns,
  type FormInst,
  type FormRules,
} from 'naive-ui'
import { motion } from 'motion-v'
import { Plus } from 'lucide-vue-next'
import {
  createCategory,
  deleteCategory,
  pageQueryCategories,
  updateCategory,
  type Category,
} from '@/api/category'

const message = useMessage()

// ============================= 辅助函数 =============================

/**
 * 格式化 ISO 日期时间字符串，去除生硬的 T 分隔符与冗余秒数
 * 例: "2026-09-20T08:13:01" -> "2026-09-20 08:13"
 */
function formatDateTime(val?: string) {
  if (!val) return '-'
  return val.replace('T', ' ').substring(0, 16)
}

// ============================= 核心状态 =============================

// 列表与加载状态
const categoryList = ref<Category[]>([])
const loading = ref(false)

// 远程服务端分页状态
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  prefix: (info: { itemCount?: number }) => `共 ${info.itemCount ?? 0} 个分类`,
})

// 弹窗表单状态
const showModal = ref(false)
const modalLoading = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)

const formRef = ref<FormInst | null>(null)
const formModel = reactive({
  name: '',
})

const formRules: FormRules = {
  name: [
    { required: true, message: '分类名称不能为空', trigger: ['blur', 'input'] },
    {
      validator: (_rule: unknown, value: string) => {
        if (!value || value.trim().length === 0) {
          return new Error('分类名称不能全为空格')
        }
        if (value.trim().length > 50) {
          return new Error('分类名称最多 50 个字符')
        }
        return true
      },
      trigger: ['blur', 'input'],
    },
  ],
}

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

// ============================= 弹窗与增改逻辑 =============================

function handleOpenCreateModal() {
  isEdit.value = false
  editId.value = null
  formModel.name = ''
  showModal.value = true
}

function handleOpenEditModal(row: Category) {
  isEdit.value = true
  editId.value = row.id
  formModel.name = row.name
  showModal.value = true
}

function handleSave() {
  formRef.value?.validate(async (errors: unknown) => {
    if (errors) return

    modalLoading.value = true
    try {
      if (isEdit.value && editId.value !== null) {
        await updateCategory(editId.value, formModel.name.trim())
        message.success('分类修改成功')
      } else {
        await createCategory(formModel.name.trim())
        message.success('分类创建成功')
      }
      showModal.value = false
      await loadCategoryPage()
    } catch (error) {
      console.error('保存分类失败:', error)
    } finally {
      modalLoading.value = false
    }
  })
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
  <div class="max-w-5xl mx-auto w-full space-y-8">
    
    <!-- 页面标题与操作区 -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-5 border-b border-black/5">
      <div>
        <div class="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase mb-1">
          CATEGORIES
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-stone-900 leading-snug">
          分类管理
        </h1>
        <p class="text-xs text-stone-500 mt-1">
          维护博客文章的业务分类归档，支持新增、重命名与安全删除。
        </p>
      </div>

      <!-- 新建分类按钮 -->
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

    <!-- 主表格卡片：底部分页栏独立分隔并扩大行高与内边距 -->
    <div class="glass-panel rounded-2xl overflow-hidden border border-white/70 shadow-sm">
      <NDataTable
        :columns="columns"
        :data="categoryList"
        :loading="loading"
        :remote="true"
        :pagination="paginationReactive"
        :row-key="(row: Category) => row.id"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>

    <!-- 新建 / 编辑分类弹窗 -->
    <NModal
      v-model:show="showModal"
      preset="card"
      :title="isEdit ? '编辑分类' : '新建分类'"
      class="max-w-md"
      :bordered="true"
      :mask-closable="!modalLoading"
    >
      <NForm ref="formRef" :model="formModel" :rules="formRules" class="space-y-4 pt-2">
        <NFormItem label="分类名称" path="name">
          <NInput
            v-model:value="formModel.name"
            placeholder="请输入分类名称（如：技术思考、生活随笔、读书笔记）"
            :maxlength="50"
            show-count
            clearable
            @keydown.enter.prevent="handleSave"
          />
        </NFormItem>
        <p class="text-xs text-stone-400 -mt-2">1 ~ 50 个字符，不可重名或全为空白符。</p>
      </NForm>

      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <NButton :disabled="modalLoading" @click="showModal = false">
            取消
          </NButton>
          <NButton
            type="primary"
            :loading="modalLoading"
            @click="handleSave"
          >
            确认保存
          </NButton>
        </div>
      </template>
    </NModal>

  </div>
</template>
