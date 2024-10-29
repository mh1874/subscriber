<template>
  <view>
    <view class="common-functions">
      <u-grid :col="3" :border="false">
        <u-grid-item @click="toPccz">
          <u-image width="32px" height="32px" :src="pcczIcon"></u-image>
          <view class="grid-text">破产重整</view>
        </u-grid-item>
        <u-grid-item @click="toOptional">
          <u-image width="32px" height="32px" :src="optionalIcon"></u-image>
          <view class="grid-text">自选股</view>
        </u-grid-item>
        <u-grid-item @click="toActivity">
          <u-image width="32px" height="32px" :src="memberIcon"></u-image>
          <view class="grid-text">会员升级</view>
        </u-grid-item>
      </u-grid>
    </view>
  </view>
</template>

<script setup lang="ts">
import pcczIcon from '@/static/common/pccz.png'
import optionalIcon from '@/static/common/optional.png'
import memberIcon from '@/static/common/member.png'

// 跳转破产重整列表
const toPccz = () => {
  uni.navigateTo({ url: '/pages/functions/pccz' })
}

// 跳转自选股列表
const toOptional = () => {
  uni.navigateTo({ url: '/pages/functions/optional' })
}

// 跳转会员升级
const toActivity = () => {
  uni.navigateTo({ url: '/pages/mine/detail/activity' })
}
</script>

<style lang="scss" scoped>
.common-functions {
  .grid-text {
    color: #2d515e;
    margin-top: 6px;
    font-weight: 500;
    font-size: 14px;
  }
}
</style>
