<template>
  <view class="mine-page">
    <view class="personal">
      <image
        class="avatar"
        :src="data.userInfo.avatar"
        mode="aspectFill"
      ></image>
      <view class="user-info">
        <text> 用户ID：{{ data.userInfo.userId }} </text>
        <text> 今日推送：{{ data.userInfo.pushCount }} 次</text>
      </view>
    </view>
    <view class="setting">
      <u-cell-group>
        <u-cell-item icon="integral-fill" title="会员等级"></u-cell-item>
        <u-cell-item icon="bell-fill" title="提醒设置"></u-cell-item>
        <u-cell-item icon="question" title="常见问题"></u-cell-item>
        <u-cell-item icon="email-fill" title="反馈与建议"></u-cell-item>
        <u-cell-item icon="setting-fill" title="关于"></u-cell-item>
      </u-cell-group>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import defaultAvatar from '@/static/logo.png'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const { userId } = storeToRefs(authStore)

const data = reactive({ userInfo: {} })

onMounted(() => {
  data.userInfo = {
    avatar: defaultAvatar,
    userId,
    pushCount: 5
  }
})
</script>

<style scoped>
.mine-page {
  background-color: #f0f0f0;
}
.personal {
  padding: 20px;
  background-color: #fff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
}
</style>
