<template>
  <view class="big-v-item">
    <template v-if="mode === 'bigV'">
      <view class="user-info" @click="toBigVDetail">
        <image
          class="avatar"
          :src="props.item.avatar"
          mode="aspectFill"
        ></image>
        <view class="text-sm">
          <view class="font-bold text-base mb-1">{{ props.item.nick }}</view>
          <view class="fans">
            <text class="mr-5 text-xs"> 粉丝：{{ props.item.fans_num }} </text>
            <text class="text-xs">订阅：{{ props.item.wx_fans_num }}</text>
          </view>
          <view class="intro text-xs">{{ props.item.intro }}</view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="search-user-info">
        <image
          class="avatar"
          :src="props.item.avatar"
          mode="aspectFill"
        ></image>
        <view class="font-bold text-sm">{{ props.item.nick }}</view>
      </view>
    </template>
    <u-button
      class="follow-btn"
      shape="circle"
      :type="props.item.is_follow ? 'info' : 'success'"
      size="mini"
      @click="handleFollow"
    >
      <view class="flex items-center">
        <template v-if="props.item.is_follow">
          <u-icon name="list" size="24" class="mr-1"></u-icon>
          <text>已订阅</text>
        </template>
        <template v-else>
          <u-icon name="plus" size="24" class="mr-1"></u-icon>
          <text>订阅</text>
        </template>
      </view>
    </u-button>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface IMode {
  bigV?: string
  search?: string
}

const props = defineProps({
  mode: {
    type: String,
    default: 'bigV',
    required: true,
    validator: (value: string) => ['bigV', 'search'].includes(value)
  },
  item: {
    type: Object,
    required: true
  }
})

const pageList = getCurrentPages()
const currentPage = pageList[pageList.length - 1]?.route
const bigVWhiteList = ['pages/bigV/index']

const emits = defineEmits(['follow'])

const handleFollow = () => {
  emits('follow', props.item)
}

// 跳转消息详情
const toBigVDetail = () => {
  // 牛人列表可以跳转消息详情
  if (!bigVWhiteList.includes(currentPage)) return
  uni.navigateTo({
    url: `/pages/bigV/detail?id=${props.item.bigv_id}`
  })
}
</script>

<style lang="scss" scoped>
.big-v-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  padding-right: 20px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .fans {
    color: #888;
    margin-bottom: 5px;
  }
  .intro {
    color: #666;
    margin-bottom: 5px;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.search-user-info {
  display: flex;
  align-items: center;
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.follow-btn {
  ::v-deep button {
    width: 64px;
  }
}
</style>
