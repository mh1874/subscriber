<template>
  <view class="feedback-page">
    <view class="text-base font-medium mb-3">还想关注其他牛人？</view>
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
        收录建议我们会尽快处理，请耐心等待。如有必要，可以通过
        <text class="text-orange-400" @click="toAbout">【关于秒速球】</text>
        页面的作者微信联系我们~。
      </view>
    </view>
    <u-button type="success" plain @click="submitFeedback"> 提交 </u-button>
    <!-- 推送次数提示弹窗 -->
    <upgrade-modal ref="upgradeModalRef" :options="modalOptions" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/store'
import { mineApi } from '@/api'
import UpgradeModal from '@/components/upgradeModal.vue'

const userStore = useUserStore()
const feedbackVal = ref('')
const feedbackOptions = {
  border: true,
  height: 200,
  autoHeight: true,
  maxlength: 500,
  placeholder: '请输入想关注的牛人信息 ~ '
}
const upgradeModalRef = ref<HTMLElement | null>(null)
const modalOptions = ref({
  title: '温馨提示',
  content:
    '因作者精力有限=_=，暂只接受会员的收录建议，可以通过 分享、观看广告、升级 成为我们的会员！'
})

// 是否为普通用户
const isNormalUser = computed(() => userStore.userInfo?.userLevel === 1)

const submitFeedback = (): void => {
  // 暂只接受会员的收录建议
  if (isNormalUser.value) {
    upgradeModalRef.value && upgradeModalRef.value.openModal()
    return
  }
  if (!feedbackVal.value) {
    uni.showToast({ title: '请输入反馈内容', icon: 'none' })
    return
  }
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
// 跳转【关于秒速球】
const toAbout = () => {
  uni.navigateTo({ url: '/pages/mine/detail/about' })
}
</script>

<style lang="scss" scoped>
.feedback-page {
  padding: 15px;
  .tips {
    color: #999;
    font-size: 14px;
    margin: 15px 0;
  }
}
</style>
