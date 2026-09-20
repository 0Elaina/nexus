<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NSelect,
  NSpace,
  useMessage,
  type FormInst,
  type FormRules,
  type SelectOption,
} from 'naive-ui'
import { createArticle } from '@/api/article'

const props = defineProps<{
  show: boolean
  categoryOptions: SelectOption[]
  defaultCategoryId?: number | null
}>()

const emit = defineEmits<{
  (e: 'update:show', val: boolean): void
  (e: 'success'): void
}>()

const message = useMessage()
const modalSubmitting = ref(false)
const createFormRef = ref<FormInst | null>(null)

const createForm = reactive({
  title: '',
  categoryId: null as number | null,
  summary: '',
  content: '',
})

const createRules: FormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: ['blur', 'input'] },
    { max: 150, message: '标题最多 150 个字符', trigger: ['blur', 'input'] },
  ],
  categoryId: [
    { required: true, type: 'number', message: '请选择文章分类', trigger: ['blur', 'change'] },
  ],
  content: [
    { required: true, message: '请输入 Markdown 正文内容', trigger: ['blur', 'input'] },
  ],
  summary: [
    { max: 300, message: '摘要最多 300 个字符', trigger: ['blur', 'input'] },
  ],
}

// 每次打开弹窗时重置表单并赋默认分类
watch(
  () => props.show,
  (val) => {
    if (val) {
      createForm.title = ''
      createForm.categoryId = props.defaultCategoryId ?? null
      createForm.summary = ''
      createForm.content = ''
    }
  }
)

async function submitArticle(status: number) {
  if (!createFormRef.value) return
  try {
    await createFormRef.value.validate()
  } catch {
    return
  }

  modalSubmitting.value = true
  try {
    await createArticle({
      title: createForm.title.trim(),
      categoryId: createForm.categoryId!,
      summary: createForm.summary.trim() || undefined,
      content: createForm.content,
      status,
    })
    message.success(status === 1 ? '文章发布成功！' : '草稿保存成功！')
    emit('update:show', false)
    emit('success')
  } catch (error) {
    console.error('文章保存失败:', error)
  } finally {
    modalSubmitting.value = false
  }
}
</script>

<template>
  <NModal
    :show="show"
    preset="card"
    title="撰写新文章"
    class="max-w-2xl w-full rounded-2xl shadow-xl border border-white/80"
    :segmented="{ content: 'soft', footer: 'soft' }"
    :mask-closable="!modalSubmitting"
    @update:show="(val) => emit('update:show', val)"
  >
    <NForm
      ref="createFormRef"
      :model="createForm"
      :rules="createRules"
      label-placement="top"
      require-mark-placement="right-hanging"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <NFormItem label="文章标题" path="title">
            <NInput
              v-model:value="createForm.title"
              placeholder="例如：深入理解 Vue3 响应式原理"
              maxlength="150"
              show-count
            />
          </NFormItem>
        </div>

        <div>
          <NFormItem label="归属分类" path="categoryId">
            <NSelect
              v-model:value="createForm.categoryId"
              :options="categoryOptions"
              placeholder="选择分类"
            />
          </NFormItem>
        </div>
      </div>

      <NFormItem label="文章摘要 (可选)" path="summary">
        <NInput
          v-model:value="createForm.summary"
          type="textarea"
          :rows="2"
          maxlength="300"
          show-count
          placeholder="留空时系统将自动从正文中剔除 Markdown 标号并截取前 150 字..."
        />
      </NFormItem>

      <NFormItem label="Markdown 正文内容" path="content">
        <NInput
          v-model:value="createForm.content"
          type="textarea"
          :rows="10"
          placeholder="支持输入 Markdown 源码，如标题 #、列表 -、代码块 ``` 等..."
          class="font-mono text-sm"
        />
      </NFormItem>
    </NForm>

    <template #footer>
      <div class="flex items-center justify-between">
        <span class="text-xs text-stone-400 font-sans">
          提示：留空摘要将自动提取正文前 150 字
        </span>
        <NSpace>
          <NButton :disabled="modalSubmitting" @click="emit('update:show', false)">
            取消
          </NButton>
          <NButton
            secondary
            :loading="modalSubmitting"
            @click="submitArticle(0)"
          >
            存为草稿
          </NButton>
          <NButton
            type="primary"
            :loading="modalSubmitting"
            @click="submitArticle(1)"
          >
            立即发布
          </NButton>
        </NSpace>
      </div>
    </template>
  </NModal>
</template>
