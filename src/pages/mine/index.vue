<template>
  <view class="mine-page">
    <view class="personal">
      <image
        class="avatar"
        :src="data.userInfo.avatar"
        mode="aspectFill"
      ></image>
      <view class="user-info">
        <view class="flex justify-between items-center">
          <view class="flex items-center">
            <text>用户ID：{{ data.userInfo.userId }}</text>
            <image
              class="member-icon ml-1.5"
              :src="data.userInfo.memberIcon"
              mode="aspectFill"
            ></image>
          </view>
          <text class="text-slate-500 text-xs" v-if="data.userInfo.expireDate">
            {{ data.userInfo.expireDate }}到期
          </text>
        </view>
        <view>
          <view>
            当日推送次数
            <text class="text-orange-400">
              {{ data.userInfo.freeNoticeNum }}
            </text>
            次
          </view>
          <view>
            奖励推送次数
            <text class="text-orange-400">
              {{ data.userInfo.rewardNoticeNum }}
            </text>
            次
          </view>
        </view>
      </view>
    </view>
    <view class="mb-4" @click="toDetail('about')">
      <u-notice-bar
        font-size="20rpx"
        mode="vertical"
        :duration="3000"
        type="warning"
        more-icon
        :list="noticeList"
      ></u-notice-bar>
    </view>
    <view class="setting">
      <u-cell-group>
        <u-cell-item
          v-for="it in detailList"
          :key="it.key"
          :icon="it.icon"
          :title="it.title"
          :class="{ 'vital-item': !!it.type }"
          @click="toDetail(it.key)"
        >
          <view v-show="it.actionType">
            <template v-slot:label>
              <button class="share-btn" plain open-type="share">去分享</button>
            </template>
          </view>
        </u-cell-item>
      </u-cell-group>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import { mineApi } from '@/api'
import { getUserId } from '@/api/token'
import { useUserStore } from '@/store'
import vipIcon from '@/static/member/vip.png'
import svipIcon from '@/static/member/svip.png'

const data = reactive({ userInfo: {} })
const userStore = useUserStore()

const userLevelEnum = {
  2: vipIcon,
  3: svipIcon
}

const getUserInfo = () => {
  mineApi.getUserInfo().then((res) => {
    if (res.status !== 1) return
    data.userInfo = {
      avatar: 'https://www.lovecf.cn/app/logo.png',
      userName: '秒速球',
      userId: res.data.user_id,
      freeNoticeNum: res.data.notice_num_free,
      rewardNoticeNum: res.data.notice_num_reward,
      userLevel: res.data.user_level,
      memberIcon: userLevelEnum[res.data.user_level],
      expireDate: res.data.user_level_expire_date
    }
    userStore.setUserInfo(data.userInfo)
  })
}

// 滚动通知列表
// const noticeList = ['会员超值购！SVIP低价抢购中', '特惠！SVIP低至0.79元/天']
const noticeList = ['对功能有疑问、建议，可随时联系我们！']

const detailList = [
  {
    key: 'reminder',
    icon: 'bell',
    title: '消息提醒设置（推送需要）',
    type: 'important'
  },
  // {
  //   key: 'activity',
  //   icon: 'share',
  //   title: '限时邀请新用户，送会员啦',
  //   type: 'important'
  // },
  {
    key: 'share',
    icon: 'share',
    title: '邀新限时送会员啦 🎉 ',
    type: 'important',
    actionType: 'share'
  },
  // { key: 'member', icon: 'integral', title: '会员升级' },
  { key: 'problem', icon: 'question', title: '常见问题' },
  { key: 'feedback', icon: 'email', title: '反馈和建议' },
  { key: 'about', icon: 'setting', title: '关于秒速球' }
]

const toDetail = (key: string) => {
  // 分享无需跳转详情
  if (key === 'share') return
  const url = `/pages/mine/detail/${key}`
  uni.navigateTo({ url })
}

onLoad(() => {
  if (userStore.userInfo?.userId) {
    data.userInfo = userStore.userInfo
  } else {
    getUserInfo()
  }
})

onShow(() => {
  // 分享链接携带用户id
  const userId = getUserId()
  uni.$u.mpShare.path = `/pages/message/index?shareId=${userId}`
  uni.$u.mpShare.imageUrl = 'https://www.lovecf.cn/app/share.png'
})

onPullDownRefresh(async () => {
  await getUserInfo()
  uni.stopPullDownRefresh()
})
</script>

<style lang="scss" scoped>
.mine-page {
  background-color: #f0f0f0;
}
.personal {
  padding: 20px;
  background-color: #fff;
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
  width: 100%;
  display: flex;
  flex-direction: column;
  line-height: 30px;
}
.member-icon {
  width: 30px;
  height: 20px;
}
.vital-item {
  ::v-deep .u-cell {
    color: $danger-color;
  }
}
::v-deep .u-cell__value {
  .share-btn {
    padding: 0;
    border: none;
    line-height: 27px;
    font-size: 14px;
    color: $danger-color;
    text-align: right;
  }
}
</style>
