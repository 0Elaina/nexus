<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import {
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NCard,
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
import {
  createCategory,
  deleteCategory,
  pageQueryCategories,
  updateCategory,
  type Category,
} from '@/api/category'

const message = useMessage()

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
  prefix: (info: { itemCount?: number }) => `共 ${info.itemCount ?? 0} 条记录`,
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
          return new Error('分类名称最多50个字符')
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
    width: 90,
    render(row: Category) {
      return h('span', { class: 'font-mono text-zinc-400 text-xs' }, row.id)
    },
  },
  {
    title: '分类名称',
    key: 'name',
    render(row: Category) {
      return h(
        NTag,
        {
          size: 'small',
          bordered: false,
        },
        { default: () => row.name }
      )
    },
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 200,
    render(row: Category) {
      return h('span', { class: 'text-zinc-500 font-mono text-xs' }, row.createdAt || '-')
    },
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 200,
    render(row: Category) {
      return h('span', { class: 'text-zinc-500 font-mono text-xs' }, row.updatedAt || '-')
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 160,
    align: 'right',
    render(row: Category) {
      return h(
        NSpace,
        { justify: 'end', align: 'center', size: 16 },
        () => [
          // 编辑按钮：依托主题 primaryColor，不手写颜色魔法类
          h(
            NButton,
            {
              text: true,
              type: 'primary',
              size: 'small',
              onClick: () => handleOpenEditModal(row),
            },
            { default: () => '编辑' }
          ),
          // 气泡二次确认删除：依托主题 error 语义色，不手写 rose-600 类
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

/**
 * 获取分页数据 (对接后端 GET /api/categories/page)
 */
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

/**
 * 页码切换回调
 */
function handlePageChange(page: number) {
  paginationReactive.page = page
  loadCategoryPage()
}

/**
 * 每页条数切换回调
 */
function handlePageSizeChange(pageSize: number) {
  paginationReactive.pageSize = pageSize
  paginationReactive.page = 1
  loadCategoryPage()
}

// ============================= 弹窗与增改逻辑 =============================

/**
 * 打开新建弹窗
 */
function handleOpenCreateModal() {
  isEdit.value = false
  editId.value = null
  formModel.name = ''
  showModal.value = true
}

/**
 * 打开编辑弹窗
 */
function handleOpenEditModal(row: Category) {
  isEdit.value = true
  editId.value = row.id
  formModel.name = row.name
  showModal.value = true
}

/**
 * 提交表单保存 (支持新建 POST 与修改 PUT)
 */
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

/**
 * 删除分类 (对接 DELETE /api/categories/{id})
 */
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
  <div class="max-w-5xl mx-auto w-full space-y-6">
    <!-- 原生面包屑组件替代手写 div/span -->
    <NBreadcrumb>
      <NBreadcrumbItem>管理中心</NBreadcrumbItem>
      <NBreadcrumbItem>分类管理</NBreadcrumbItem>
    </NBreadcrumb>

    <!-- 页面标题与主操作区 (仅宏观 Flex 布局使用 Tailwind) -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/80">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900">分类管理</h1>
        <p class="text-xs text-zinc-500 mt-1">维护文章的业务类别与聚合归档，支持高频新增、重命名与安全删除。</p>
      </div>

      <!-- 纯语义驱动按钮：依托主题 primaryColor，移除硬编码 bg-zinc-900 / hover 等 -->
      <NButton
        type="primary"
        @click="handleOpenCreateModal"
      >
        <template #icon>
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </template>
        新建分类
      </NButton>
    </div>

    <!-- 主表格卡片：完全依托 NCard 自身主题属性与边框系统，移除冗余覆盖类 -->
    <NCard :bordered="true">
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
    </NCard>

    <!-- 新建 / 编辑分类弹窗：依托 preset="card" 规范主题样式 -->
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
            placeholder="请输入分类名称（如：系统设计、算法日记）"
            :maxlength="50"
            show-count
            clearable
            @keydown.enter.prevent="handleSave"
          />
        </NFormItem>
        <p class="text-xs text-zinc-400 -mt-2">1 ~ 50 个字符，不可重名或全为空白符。</p>
      </NForm>

      <template #footer>
        <div class="flex items-center justify-end gap-2.5">
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
