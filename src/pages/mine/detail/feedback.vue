<template>
  <view class="feedback-page">
    <view class="text-base font-medium mb-3">反馈和建议</view>
    <view class="mb-7">
      <u-input
        trim
        type="textarea"
        v-model="feedbackVal"
        :border="feedbackOptions.border"
        :height="feedbackOptions.height"
        :auto-height="feedbackOptions.autoHeight"
        :maxlength="feedbackOptions.maxlength"
        :placeholder="feedbackOptions.placeholder"
      />
      <view class="tips">
        反馈的内容我们会尽快处理，会优先处理会员建议，请耐心等待，如有必要，可以去“关于”页面添加微信联系我们~。
      </view>
    </view>
    <u-button type="success" plain @click="submitFeedback"> 提交 </u-button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { mineApi } from '@/api'

const feedbackVal = ref('')
const feedbackOptions = {
  border: true,
  height: 200,
  autoHeight: true,
  maxlength: 500,
  placeholder: '请输入您要反馈的问题或建议'
}

const submitFeedback = (): void => {
  const params = { content: feedbackVal.value }
  mineApi
    .submitFeedback(params)
    .then(({ status, msg }) => {
      if (status !== 1) return
      uni.showToast({
        title: msg,
        icon: 'none'
      })
    })
    .finally(() => {
      feedbackVal.value = ''
    })
}

onLoad(() => {})
</script>

<style lang="scss" scoped>
.feedback-page {
  padding: 15px;
  .tips {
    color: #999;
    font-size: 12px;
    margin: 15px 0;
  }
}
</style>
