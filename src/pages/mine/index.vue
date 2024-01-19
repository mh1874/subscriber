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
        <text> 今日推送：{{ data.userInfo.noticeNum }} 次</text>
      </view>
    </view>
    <view class="setting">
      <u-cell-group>
        <u-cell-item
          icon="share-fill"
          title="我的分享"
          @click="toDetail('userLevel')"
        ></u-cell-item>
        <u-cell-item
          icon="integral-fill"
          title="会员升级"
          @click="toDetail('member')"
        ></u-cell-item>
        <u-cell-item icon="bell-fill" title="提醒设置"></u-cell-item>
        <u-cell-item icon="question" title="常见问题"></u-cell-item>
        <u-cell-item
          icon="email-fill"
          title="反馈和建议"
          @click="toDetail('feedback')"
        ></u-cell-item>
        <u-cell-item icon="setting-fill" title="关于"></u-cell-item>
      </u-cell-group>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { reactive } from 'vue'
import { mineApi } from '@/api'
import defaultAvatar from '@/static/logo.png'
import { useUserStore } from '@/store'

const data = reactive({ userInfo: {} })
const userStore = useUserStore()

const getUserInfo = () => {
  mineApi.getUserInfo().then((res) => {
    if (res.status !== 1) return
    data.userInfo = {
      avatar: defaultAvatar,
      userName: 'John Doe',
      userId: res.data.user_id,
      noticeNum: res.data.notice_num,
      userLevel: res.data.user_level
    }
    userStore.setUserInfo(data.userInfo)
  })
}

const toDetail = (key: string) => {
  const url = `/pages/mine/detail/${key}`
  // switch (key) {
  //   case 'userLevel':
  //     url = `/pages/mine/detail/${key}`
  //     break
  //   case 'member':
  //     url = `/pages/mine/detail/${key}`
  //     break
  //   default:
  //     break
  // }
  uni.navigateTo({ url })
}

onLoad(() => {
  getUserInfo()
})

onShow(() => {
  uni.$u.mpShare.path = ''
  uni.$u.mpShare.imageUrl = ''
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
