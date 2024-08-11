<template>
  <view class="message-item">
    <view class="user-info" @click="toBigVDetail">
      <image
        class="avatar"
        :src="props.item.bigv.avatar"
        mode="aspectFill"
      ></image>
      <view class="mr-2">
        <view class="nick-name">{{ props.item.bigv.nick }}</view>
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
          @linktap="copyLink"
          :content="props.item.message"
        />
      </view>
      <view v-if="props.item.retweeted_message" class="retweeted">
        <mp-html
          :copy-link="false"
          :preview-img="false"
          @linktap="copyLink"
          :content="handledRetweeted"
        />
      </view>
    </view>
    <template v-if="props.item.pic_list.length">
      <view class="img-container">
        <view
          class="img-item"
          v-for="(it, index) in props.item.pic_list"
          :key="index"
        >
          <image
            :src="it"
            mode="aspectFill"
            class="content-img"
            @click="previewHandler(it)"
          ></image>
        </view>
      </view>
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
import { computed, defineProps, defineEmits, getCurrentInstance } from 'vue'
import { useCopyLink } from '@/hooks/useCopyLink'

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

// 用于判断是否为外部链接 & 点击链接复制
const { isHttpUrl, copyLink } = useCopyLink()
const handledRetweeted = computed(() =>
  isHttpUrl(props.item.retweeted_message)
    ? `<a>${props.item.retweeted_message}</a>`
    : props.item.retweeted_message
)

// 获取相对时间
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

const emits = defineEmits(['preview'])

// 图片预览方法
const previewHandler = (url: string) => {
  emits('preview')
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
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .nick-name {
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 2px;
  }
  .time {
    color: #888;
    font-size: 13px;
  }
}

.message-content {
  margin: 8px 0;
  font-size: 16px;
  line-height: 26px;
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
    }
  }
}
</style>
