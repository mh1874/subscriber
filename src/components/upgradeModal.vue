<template>
  <u-modal
    v-model="modalVisible"
    :title="options.title"
    :content="options.content"
    :mask-close-able="true"
  >
    <template v-slot:confirm-button>
      <view class="modal-btns">
        <button class="action-btn confirm" plain @click="toActivity">
          去看看
        </button>
        <button class="action-btn cancel" plain @click="closeModal">
          取消
        </button>
      </view>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, defineEmits, watch, onMounted } from 'vue'
import type { PropType } from 'vue'

interface IOptions {
  title: string
  content: string
}

defineProps({
  options: {
    type: Object as PropType<IOptions>,
    default: () => {
      return { title: '提示', content: '内容' }
    }
  }
})
const modalVisible = ref<boolean>(false)

// 打开提示弹窗
const openModal = () => {
  modalVisible.value = true
}

// 跳转活动页面
const toActivity = () => {
  uni.navigateTo({ url: '/pages/mine/detail/activity' })
  uni.setStorageSync('UPGRADE_SHOWN', true)
}

// 关闭提示弹窗
const closeModal = () => {
  modalVisible.value = false
  uni.setStorageSync('UPGRADE_SHOWN', true)
}

const instance = getCurrentInstance()
const emit = defineEmits(['register'])
onMounted(() => {
  const modalInstance = { openModal }
  instance && emit('register', modalInstance, getCurrentInstance()?.uid)
})

defineExpose({
  openModal
})
</script>

<style lang="scss" scoped>
.modal-btns {
  display: flex;
  height: 100%;
  .action-btn {
    flex: 1;
    padding: 0;
    border: none;
    border-radius: 0;
    line-height: 50px;
    font-size: 15px;
    text-align: center;
  }
  .confirm {
    font-weight: 600;
    color: $main-color;
    border-right: 1px solid #e5e5e5;
  }
  .cancel {
    color: #606266;
    font-weight: 500;
  }
}
</style>
