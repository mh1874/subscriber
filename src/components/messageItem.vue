<template>
  <view class="message-item">
    <view class="user-info" @click="toBigVDetail">
      <image
        class="avatar"
        :src="props.item.bigv.avatar"
        mode="aspectFill"
      ></image>
      <view class="mr-2">
        <view class="font-bold text-sm">{{ props.item.bigv.nick }}</view>
        <view class="time">
          {{ formatTime(props.item.source_created_time) }}
        </view>
      </view>
    </view>
    <view class="message-content" @click="toMessageDetail">
      <view class="mb-1">
        <mp-html
          :copy-link="false"
          :preview-img="false"
          :content="props.item.message"
        />
      </view>
      <view v-if="props.item.retweeted_message" class="retweeted">
        <mp-html
          :copy-link="false"
          :preview-img="false"
          :content="props.item.retweeted_message"
        />
      </view>
    </view>
    <template v-if="props.item.pic_list.length">
      <div class="img-container">
        <div
          class="img-item"
          v-for="(it, index) in props.item.pic_list"
          :key="index"
        >
          <image
            class="content-img"
            :src="it"
            @click="previewHandler(it)"
          ></image>
        </div>
      </div>
    </template>
    <view
      v-if="props.item.needExpand"
      class="text-right"
      @click="toMessageDetail"
    >
      阅读全文
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => {
      return { pic_list: [] }
    }
  }
})

// 格式化时间的函数
const formatTime = (time: string) => {
  return proxy.$dayjs(time).fromNow()
}

const pageList = getCurrentPages()
const currentPage = pageList[pageList.length - 1]?.route
const messageWhiteList = ['pages/message/index', 'pages/bigV/detail']
const bigVWhiteList = ['pages/message/index']

// 跳转牛人动态
const toBigVDetail = () => {
  // 消息列表可以跳转牛人动态
  if (!bigVWhiteList.includes(currentPage)) return
  uni.navigateTo({
    url: `/pages/bigV/detail?id=${props.item.bigv_id}`
  })
}

// 跳转消息详情
const toMessageDetail = () => {
  // 消息列表、牛人动态可以跳转消息详情
  if (!messageWhiteList.includes(currentPage)) return
  uni.navigateTo({
    url: `/pages/message/detail?id=${props.item.mes_id}`
  })
}

// 图片预览方法
const previewHandler = (url: string) => {
  uni.previewImage({
    current: url,
    urls: props.item.pic_list
  })
}
</script>

<style lang="scss" scoped>
.message-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  .user-info {
    display: flex;
    align-items: center;
  }
  .avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .time {
    color: #888;
    font-size: 12px;
  }
}

.message-content {
  margin: 8px 0;
  .retweeted {
    padding: 15px 10px;
    background-color: #f7f7f7;
  }
}
.img-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  .img-item {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding-top: 100%;
    .content-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: contain;
    }
  }
}
</style>
