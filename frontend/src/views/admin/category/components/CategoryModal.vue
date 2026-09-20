<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NSpace,
  useMessage,
  type FormInst,
  type FormRules,
} from 'naive-ui'
import { createCategory, updateCategory, type Category } from '@/api/category'

const props = defineProps<{
  show: boolean
  isEdit: boolean
  category: Category | null
}>()

const emit = defineEmits<{
  (e: 'update:show', val: boolean): void
  (e: 'success'): void
}>()

const message = useMessage()
const modalLoading = ref(false)
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

// 每次打开弹窗时同步数据
watch(
  () => props.show,
  (val) => {
    if (val) {
      formModel.name = props.isEdit && props.category ? props.category.name : ''
    }
  }
)

function handleSave() {
  formRef.value?.validate(async (errors: unknown) => {
    if (errors) return

    modalLoading.value = true
    try {
      if (props.isEdit && props.category) {
        await updateCategory(props.category.id, formModel.name.trim())
        message.success('分类修改成功')
      } else {
        await createCategory(formModel.name.trim())
        message.success('分类创建成功')
      }
      emit('update:show', false)
      emit('success')
    } catch (error) {
      console.error('保存分类失败:', error)
    } finally {
      modalLoading.value = false
    }
  })
}
</script>

<template>
  <NModal
    :show="show"
    preset="card"
    :title="isEdit ? '编辑分类' : '新建分类'"
    class="max-w-md w-full rounded-2xl shadow-xl border border-white/80"
    :segmented="{ content: 'soft', footer: 'soft' }"
    :mask-closable="!modalLoading"
    @update:show="(val) => emit('update:show', val)"
  >
    <NForm
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      label-placement="top"
      require-mark-placement="right-hanging"
    >
      <NFormItem label="分类名称" path="name">
        <NInput
          v-model:value="formModel.name"
          placeholder="例如：技术分享、读书随笔..."
          maxlength="50"
          show-count
          clearable
          @keydown.enter="handleSave"
        />
      </NFormItem>
    </NForm>

    <template #footer>
      <div class="flex items-center justify-end">
        <NSpace>
          <NButton :disabled="modalLoading" @click="emit('update:show', false)">
            取消
          </NButton>
          <NButton
            type="primary"
            :loading="modalLoading"
            @click="handleSave"
          >
            保存
          </NButton>
        </NSpace>
      </div>
    </template>
  </NModal>
</template>
