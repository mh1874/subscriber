<template>
  <!-- 省略了其他部分，保留了原始的结构 -->
  <view class="member-header">
    <!-- 用户信息 -->
    <view class="user-info">
      <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
      <view class="info-text">
        <view class="font-bold user-name">{{ userInfo.userName }}</view>
        <view class="user-level">会员享多重权限 ~ </view>
      </view>
    </view>
    <!-- 会员选择Tab -->
    <view class="tab-bar">
      <text
        v-for="tab in tabs"
        :key="tab.value"
        class="tab font-bold"
        :class="{ 'tab-active': selectedTab === tab.value }"
        @click="selectTab(tab.value)"
      >
        {{ tab.label }}
      </text>
    </view>
  </view>

  <view class="member-content">
    <view class="tips">{{ getMembershipData.tips }}</view>
    <!-- 会员费用 -->
    <view class="fees">
      <view
        class="fee-card"
        v-for="(item, index) in getMembershipData.fee"
        :key="index"
        :class="{ 'fee-active': selectedMembership.id === item.id }"
        @click="chooseFee(item)"
      >
        <view class="type">{{ item.type }}</view>
        <text class="price">
          <text class="mr-0.5">￥</text>
          <text class="text-3xl">{{ item.price }}</text>
        </text>
      </view>
    </view>
    <!-- 过期时间 -->
    <view class="expire-date">
      <template v-if="selectedMembership.extraDays">
        · 限时加送
        <text class="text-orange-400">
          {{ selectedMembership.extraDays }}
        </text>
        天，
      </template>
      将于
      <text class="text-orange-400">
        {{ expireDateHandler(selectedMembership.days) }}
      </text>
      到期
    </view>
    <!-- 滚动通知 -->
    <view class="mb-3">
      <u-notice-bar
        mode="vertical"
        :duration="3000"
        type="warning"
        more-icon
        @getMore="toFeedback"
        :list="noticeList"
      ></u-notice-bar>
    </view>
    <!-- 会员权益 -->
    <view class="benefits">
      <text class="title block">会员权益</text>
      <view class="benefit-area">
        <view
          v-for="(item, index) in getMembershipData.benefit"
          :key="index"
          class="benefit-item"
        >
          <image class="icon" :src="getIcon(item.icon)" />
          <text class="name">{{ item.name }}</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 支付区域 -->
  <view class="payment">
    <text class="price">
      <text class="mr-0.5">￥</text>
      <text class="text-3xl">{{ selectedMembership.price }}</text>
    </text>
    <u-button
      class="buy-btn"
      type="success"
      shape="circle"
      size="medium"
      @click="buyMembership"
    >
      立即购买
    </u-button>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { mineApi } from '@/api'
import thirtyIcon from '@/static/member/thirty.png'
import infinityIcon from '@/static/member/infinity.png'
import pushIcon from '@/static/member/push.png'
import responseIcon from '@/static/member/response.png'
import secondIcon from '@/static/member/second.png'

const { proxy } = getCurrentInstance()
const userStore = useUserStore()

// 取需要的 state
const { userInfo } = storeToRefs(userStore)

interface MembershipFee {
  id: number
  type: string
  price: number
  days: number
  extraDays?: number
}

interface MembershipBenefit {
  name: string
  icon: string
}

interface MembershipData {
  tips: string
  fee: MembershipFee[]
  benefit: MembershipBenefit[]
}

const tabs = [
  // { label: '高级会员VIP', value: 'premium' },
  { label: '超级会员SVIP', value: 'super' }
]

const premiumMembershipData: MembershipData = {
  tips: '尊享30条推送次数、优先推送、秒级响应等多项特权',
  fee: [
    { id: 1, type: '年费VIP', price: 199, days: 375, extraDays: 10 },
    { id: 2, type: '季费VIP', price: 59, days: 93, extraDays: 3 },
    { id: 3, type: '月费VIP', price: 25, days: 30 }
  ],
  benefit: [
    { name: '每天30条推送', icon: 'fifty' },
    { name: '秒级响应', icon: 'second' },
    { name: '需求优先处理', icon: 'response' }
  ]
}

const superMembershipData: MembershipData = {
  tips: '尊享不限推送次数、优先推送、秒级响应等多项特权',
  fee: [
    { id: 4, type: '年费SVIP', price: 499, days: 375, extraDays: 10 },
    { id: 5, type: '季费SVIP', price: 149, days: 93, extraDays: 3 },
    { id: 6, type: '月费SVIP', price: 59, days: 30 }
  ],
  benefit: [
    { name: '不限条数推送', icon: 'infinity' },
    { name: '秒级响应', icon: 'second' },
    { name: '优先推送', icon: 'push' },
    { name: '需求优先处理', icon: 'response' }
  ]
}

const getIcon = (icon: string) => {
  switch (icon) {
    case 'fifty':
      return thirtyIcon
    case 'infinity':
      return infinityIcon
    case 'push':
      return pushIcon
    case 'response':
      return responseIcon
    case 'second':
      return secondIcon
    default:
      return null
  }
}

const selectedTab = ref<'premium' | 'super'>('super')
// {
//   id: 1,
//   type: '',
//   price: 199,
//   days: 375,
//   extraDays: 10
// }
const selectedMembership = ref<MembershipFee>({
  id: 4,
  type: '',
  price: 499,
  days: 375,
  extraDays: 10
})

const getMembershipData = computed(() =>
  selectedTab.value === 'premium' ? premiumMembershipData : superMembershipData
)

const selectTab = (tab: 'premium' | 'super'): void => {
  selectedTab.value = tab
  // Reset selected fee and membership when tab changes
  const initVal = getMembershipData.value.fee[0]
  selectedMembership.value = {
    id: tab === 'premium' ? 1 : 4,
    type: '',
    price: initVal.price,
    days: initVal.days,
    extraDays: initVal.extraDays
  }
}

const chooseFee = (item: MembershipFee): void => {
  selectedMembership.value = {
    id: item.id,
    type: selectedTab.value,
    price: item.price,
    days: item.days,
    extraDays: item.extraDays
  }
}

// 过期时间处理
const expireDateHandler = (days: number): string => {
  return proxy.$dayjs().add(days, 'day').format('YYYY-MM-DD')
}

// 滚动通知列表
const noticeList = [
  '会员到账需要几分钟的时间，请耐心等待~',
  '若超过半小时未到账，请向我们反馈，我们会尽快处理~'
]
// 跳转反馈页面
const toFeedback = (): void => {
  uni.navigateTo({ url: '/pages/mine/detail/feedback' })
}

// 购买会员
const buyMembership = (): void => {
  const params = {
    pay_calss: selectedMembership.value.id
  }
  mineApi.payMiniProg(params).then(({ status, data }) => {
    if (status !== 1) return
    uni.requestPayment({
      provider: 'wxpay',
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success(res) {
        uni.showToast({
          title: '支付成功',
          icon: 'none',
          duration: 3000
        })
        uni.switchTab({ url: '/pages/mine/index' })
      },
      fail(res) {
        uni.showToast({
          title: '支付失败',
          icon: 'none'
        })
        console.log('pay fail ==>', res)
      }
    })
  })
}
</script>

<style lang="scss" scoped>
page {
  background-color: #f2f3f6;
}
.member-header {
  padding: 20px 20px 10px;
  box-sizing: border-box;
  background-image: linear-gradient(to right, #130f01, #1c1208, #28130e);
  border-bottom: 5px solid #f8dbb9;
}
.member-content {
  padding: 10px 5px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .info-text {
    margin-left: 10px;
    font-size: 16px;
    .user-name {
      color: #b9b8b4;
      margin-bottom: 5px;
      font-size: 17px;
    }
    .user-level {
      color: #8e8e8d;
      font-size: 13px;
    }
  }
}

.tab-bar {
  display: flex;
  justify-content: space-around;
  .tab {
    font-size: 16px;
    padding: 5px;
    cursor: pointer;
    color: #8b8881;
    position: relative;
  }
  .tab-active {
    color: #fae6c0;
  }
  .tab-active::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #f8dbb9;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.tips {
  margin: 5px;
  padding: 8px;
  background-color: #fdf7ea;
  border: 1px solid #fcf1e3;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
  color: #c17b3d;
  font-weight: bold;
}
.fees {
  display: flex;
  margin-bottom: 10px;
  padding: 5px;
  .fee-card {
    flex: 1;
    height: 130px;
    margin-right: 10px;
    padding: 20px 5px;
    border-radius: 8px;
    background-color: #fff;
    text-align: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .type {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .price {
      color: orange;
    }
  }
  .fee-active {
    border: 2px solid #ef9c50;
    background-color: rgba(250, 225, 196, 0.7);
  }
  .fee-card:nth-last-child(1) {
    margin-right: 0;
  }
}
.expire-date {
  margin: 10px 5px;
  font-weight: 600;
}

.benefits {
  padding: 10px;
  margin: 0 5px 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .benefit-area {
    display: flex;
    padding: 10px;
    background-color: #fef9f2;
  }
  .benefit-item {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    .icon {
      width: 30px;
      height: 30px;
      margin-bottom: 5px;
    }
    .name {
      color: #563416;
      font-size: 12px;
    }
  }
}

.payment {
  position: fixed;
  bottom: 2px;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .price {
    font-weight: bold;
    color: orange;
  }
  .buy-btn {
    ::v-deep .u-btn {
      background-image: linear-gradient(to right, #fbe9c1, #f8d7ac, #f3c1aa);
      color: #62300d;
      font-weight: bold;
    }
  }
}
</style>
