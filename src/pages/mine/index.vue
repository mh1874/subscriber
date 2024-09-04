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
            <text class="whitespace-nowrap" @click="copyUserId">
              用户ID：{{ data.userInfo.userId }}
            </text>
            <image
              v-if="isMember"
              class="member-icon"
              :src="data.userInfo.memberIcon"
              mode="aspectFill"
            ></image>
          </view>
          <text class="expire-date whitespace-nowrap" v-if="isMember">
            {{ data.userInfo.expireDate }}到期
          </text>
        </view>
        <!-- 非会员显示剩余推送次数 -->
        <template v-if="isMember">
          <text>超级会员尊享无限次推送 ~ </text>
        </template>
        <template v-else>
          <text>
            当日推送次数
            <text class="text-orange-400">
              {{ data.userInfo.freeNoticeNum }}
            </text>
            次
          </text>
          <text>
            奖励推送次数
            <text class="text-orange-400">
              {{ data.userInfo.rewardNoticeNum }}
            </text>
            次
          </text>
        </template>
      </view>
    </view>
    <view class="mb-3" @click="toDetail('about')">
      <u-notice-bar
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
          <!-- <view v-show="it.actionType">
            <template v-slot:label>
              <button class="share-btn" plain open-type="share">去分享</button>
            </template>
          </view> -->
        </u-cell-item>
      </u-cell-group>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { reactive, computed } from 'vue'
import { mineApi } from '@/api'
import { getUserId } from '@/api/token'
import { useUserStore } from '@/store'
import { IUserInfo } from '@/types'
// import vipIcon from '@/static/member/vip.png'
import svipIcon from '@/static/member/svip.png'

const data = reactive<{ userInfo: IUserInfo }>({
  userInfo: {
    avatar: 'https://www.lovecf.cn/app/logo.png',
    userName: '秒速球',
    userId: 0,
    freeNoticeNum: 0,
    rewardNoticeNum: 0,
    userLevel: 0,
    memberIcon: null,
    expireDate: ''
  }
})
const userStore = useUserStore()

// const userLevelEnum: any = {
//   2: vipIcon,
//   3: svipIcon
// }

const getUserInfo = () => {
  mineApi.getUserInfo().then((res: any) => {
    if (res.status !== 1) return
    data.userInfo = {
      ...data.userInfo,
      userId: res.data.user_id,
      freeNoticeNum: res.data.notice_num_free,
      rewardNoticeNum: res.data.notice_num_reward,
      userLevel: res.data.user_level,
      // memberIcon: userLevelEnum[res.data.user_level],
      memberIcon: svipIcon,
      expireDate: res.data.user_level_expire_date
    }
    userStore.setUserInfo(data.userInfo)
  })
}

// 复制用户id
const copyUserId = () => {
  uni.setClipboardData({
    data: data.userInfo.userId.toString(),
    success() {
      uni.showToast({
        title: '用户ID已复制',
        icon: 'none'
      })
    }
  })
}

// 当前用户是否为会员
const isMember = computed(() => data.userInfo.expireDate)

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
  {
    key: 'activity',
    icon: 'thumb-up',
    title: '获取更多推送次数 ~ ',
    type: 'important'
  },
  { key: 'problem', icon: 'question', title: '常见问题' },
  { key: 'feedback', icon: 'email', title: '收录建议' },
  { key: 'about', icon: 'setting', title: '关于秒速球' }
]

const toDetail = (key: string) => {
  // 分享无需跳转详情
  if (key === 'share') return
  const url = `/pages/mine/detail/${key}`
  uni.navigateTo({ url })
}

// 初次onShow中不请求
let isNotFirst = false
onLoad(() => {
  if (userStore.userInfo?.userId) {
    data.userInfo = userStore.userInfo
  } else {
    getUserInfo()
  }
  isNotFirst = true
})

onShow(() => {
  // 分享链接携带用户id
  const userId = getUserId()
  uni.$u.mpShare.path = `/pages/message/index?shareId=${userId}`
  uni.$u.mpShare.imageUrl = 'https://www.lovecf.cn/app/share.png'
  if (isNotFirst) {
    getUserInfo()
  }
})

onPullDownRefresh(async () => {
  await getUserInfo()
  uni.stopPullDownRefresh()
})
</script>

<style lang="scss" scoped>
$normal-font-size: 15px;

.mine-page {
  background-color: #f0f0f0;
}
.personal {
  padding: 20px 18px;
  background-color: #fff;
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 18px;
}

.user-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  line-height: 30px;
  font-size: $normal-font-size;
}
.member-icon {
  width: 32px;
  height: 20px;
  margin: 0 5px;
}
.expire-date {
  color: #64748b;
  font-size: 13px;
}

.vital-item {
  ::v-deep .u-cell {
    font-weight: 400;
    color: $warning-color;
  }
}
::v-deep .u-cell_title {
  font-size: $normal-font-size !important;
}
// ::v-deep .u-cell__value {
//   .share-btn {
//     padding: 0;
//     border: none;
//     line-height: 27px;
//     font-size: 14px;
//     color: $danger-color;
//     text-align: right;
//   }
// }
</style>
