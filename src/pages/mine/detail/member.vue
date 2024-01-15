<template>
  <view class="member-page">
    <view class="member-header">
      <!-- 用户信息 -->
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        <view class="info-text">
          <view class="font-bold user-name">{{ userInfo.userName }}</view>
          <view class="user-level">{{ getUserLevel(userInfo.userLevel) }}</view>
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
      <view class="tips">尊享不限推送次数、优先推送、秒级响应等多项特权</view>
      <!-- 会员费用 -->
      <view class="fees">
        <view
          class="fee-card"
          v-for="(item, index) in currentMembershipData.fee"
          :key="index"
          :class="{ 'fee-active': selectedFee === item.id }"
          @click="chooseFee(item)"
        >
          <view class="type">{{ item.type }}</view>
          <text class="price">
            <text class="mr-0.5">￥</text>
            <text class="text-3xl">{{ item.price }}</text>
          </text>
        </view>
      </view>
      <!-- 会员权益 -->
      <view class="benefits">
        <text class="title block">会员权益</text>
        <view class="benefit-area">
          <view
            v-for="(item, index) in currentMembershipData.benefit"
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
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { getUserLevel } from '@/utils/util'
import fiftyIcon from '@/static/member/fifty.png'
import infinityIcon from '@/static/member/infinity.png'
import pushIcon from '@/static/member/push.png'
import responseIcon from '@/static/member/response.png'
import secondIcon from '@/static/member/second.png'

const userStore = useUserStore()

// 取需要的 state
const { userInfo } = storeToRefs(userStore)

interface MembershipFee {
  id: number
  type: string
  price: string
}

interface MembershipBenefit {
  name: string
  icon: string
}

interface SelectedMembership {
  id: number
  type: string
  price: string
}

interface MembershipData {
  fee: MembershipFee[]
  benefit: MembershipBenefit[]
}

const tabs = [
  { label: '普通会员', value: 'ordinary' },
  { label: '高级会员', value: 'premium' }
]

const ordinaryMembershipData: MembershipData = {
  fee: [
    { id: 1, type: '年费VIP', price: '299' },
    { id: 2, type: '季费VIP', price: '99' },
    { id: 3, type: '月费VIP', price: '29' }
  ],
  benefit: [
    { name: '每天50条推送', icon: 'fifty' },
    { name: '秒级响应', icon: 'second' },
    { name: '需求优先处理', icon: 'response' }
  ]
}

const premiumMembershipData: MembershipData = {
  fee: [
    { id: 4, type: '年费SVIP', price: '499' },
    { id: 5, type: '季费SVIP', price: '149' },
    { id: 6, type: '月费SVIP', price: '59' }
  ],
  benefit: [
    { name: '不限条数推送', icon: 'infinity' },
    { name: '秒级响应', icon: 'second' },
    { name: '优先推送', icon: 'push' },
    { name: '需求优先处理', icon: 'response' }
  ]
}

const getIcon = (icon) => {
  switch (icon) {
    case 'fifty':
      return fiftyIcon
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

const selectedTab = ref<'ordinary' | 'premium'>('ordinary')
const selectedFee = ref<number | null>(1)
const selectedMembership = ref<SelectedMembership>({
  id: 0,
  type: '',
  price: '99'
})

const currentMembershipData = computed(() =>
  selectedTab.value === 'ordinary'
    ? ordinaryMembershipData
    : premiumMembershipData
)

const getMembershipPrice = (id: string): string => {
  const dataSource =
    selectedTab.value === 'ordinary'
      ? ordinaryMembershipData.fee
      : premiumMembershipData.fee
  return dataSource.find((item) => item.id === +id)?.price ?? ''
}

watch(selectedTab, () => {
  // Update selectedMembership when tab changes
  selectedMembership.value.type = selectedTab.value
  selectedFee.value =
    selectedTab.value === 'ordinary'
      ? ordinaryMembershipData.fee[0].id
      : premiumMembershipData.fee[0].id
})

const selectTab = (tab: 'ordinary' | 'premium'): void => {
  selectedTab.value = tab
}

const chooseFee = (item: MembershipFee): void => {
  // Update selectedMembership when fee is chosen
  selectedFee.value = item.id
  selectedMembership.value.price = item.price
}

watch(selectedFee, () => {
  // Update selectedMembership when tab changes
  selectedMembership.value.price = getMembershipPrice(
    selectedFee.value.toString()
  )
})

const buyMembership = (): void => {
  // Logic to handle the purchase action
  // Replace with your actual logic
  console.log(
    `Buying ${selectedMembership.value.type} membership for ${selectedMembership.value.price}`
  )
}
</script>

<style lang="scss" scoped>
.member-header {
  padding: 20px 20px 10px;
  box-sizing: border-box;
  background-image: linear-gradient(to right, #130f01, #1c1208, #28130e);
  border-bottom: 5px solid #f8dbb9;
}
.member-content {
  padding: 10px 5px 120px;
  background-color: #f2f3f6;
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
    }
    .user-level {
      color: #8e8e8d;
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
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px -1px 5px rgba(0, 0, 0, 0.1);
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
