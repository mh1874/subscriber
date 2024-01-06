<template>
  <view class="message-item">
    <view class="user-info" @click="toBigVDetail">
      <image
        class="platform-icon"
        :src="getLogo(props.item.source_platform)"
      ></image>
      <image
        class="avatar"
        :src="props.item.bigv.avatar"
        mode="aspectFill"
      ></image>
      <view class="info-text">
        <view class="font-bold">{{ props.item.bigv.nick }}</view>
        <view class="time">{{
          formatTime(props.item.source_created_time)
        }}</view>
      </view>
    </view>
    <view class="message-content" @click="toMessageDetail">
      <mp-html :copy-link="false" :content="props.item.message" />
      <mp-html
        :copy-link="false"
        v-if="props.item.retweeted_message"
        :content="props.item.retweeted_message"
      />
      <template v-if="props.item.pic_list.length">
        <image
          v-for="(img, index) in props.item.pic_list"
          :key="index"
          :src="img"
        ></image>
      </template>
      <view v-if="props.item.needExpand" class="text-right"> 阅读全文 </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, getCurrentInstance } from 'vue'
import xueqiuLogo from '@/static/platform/xueqiu.png'
import weiboLogo from '@/static/platform/weibo.png'
import dongcaiLogo from '@/static/platform/dongcai.png'

const { proxy } = getCurrentInstance()

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// 计算属性，根据 source_platform 返回对应的 logo
const getLogo = (platform) => {
  switch (platform) {
    case 'xueqiu':
      return xueqiuLogo
    case 'weibo':
      return weiboLogo
    case 'dongcai':
      return dongcaiLogo
    default:
      return null // 如果没有匹配到，可以返回默认的 logo 或 null
  }
}
// 格式化时间的函数
const formatTime = (time: string) => {
  return proxy.$dayjs(time).fromNow()
}

const pageList = getCurrentPages()
const currentPage = pageList[pageList.length - 1]?.route
const messageWhiteList = ['pages/index/index', 'pages/bigVDetail/index']
const bigvWhiteList = ['pages/index/index']

// 跳转大V动态
const toBigVDetail = () => {
  // 消息列表可以跳转大V动态
  if (!bigvWhiteList.includes(currentPage)) return
  uni.navigateTo({
    url: `/pages/bigVDetail/index?id=${props.item.bigv_id}`
  })
}

// 跳转消息详情
const toMessageDetail = () => {
  // 消息列表、大V动态可以跳转消息详情
  if (!messageWhiteList.includes(currentPage)) return
  uni.navigateTo({
    url: `/pages/messageDetail/index?id=${props.item.mes_id}`
  })
}
</script>

<style lang="scss" scoped>
.message-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.platform-icon {
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
.avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 5px;
}

.info-text {
  margin-left: 10px;
  font-size: 14px;
}

.time {
  color: #888;
}

.message-content {
  margin-top: 10px;
}
</style>
