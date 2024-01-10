<template>
  <view class="message-detail">
    <view class="user-info">
      <image class="avatar" :src="data.item.avatar" mode="aspectFill"></image>
      <view class="info-text">
        <view class="font-bold">{{ data.item.nick }}</view>
        <view class="time">{{
          formatTime(data.item.source_created_time)
        }}</view>
      </view>
      <u-button type="success" plain size="mini">分享信息</u-button>
    </view>
    <view class="divider"></view>
    <view class="message-content">
      <mp-html :copy-link="false" :content="data.item.message" />
      <mp-html
        :copy-link="false"
        v-if="data.item.retweeted_message"
        :content="data.item.retweeted_message"
      />
      <template v-if="data.item.pic_list">
        <image
          class="content-img"
          v-for="(img, index) in data.item.pic_list"
          :key="index"
          :src="img"
        ></image>
      </template>
    </view>
    <view class="original-link">
      <view>本文版权属于原作者或组织</view>
      <view>原文地址：{{ data.item.source_url }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, reactive, getCurrentInstance } from 'vue'
import { messageApi } from '@/api'

const { proxy } = getCurrentInstance()

const messageId: number = ref(0)
const data = reactive({ item: {} })

const queryMessageDetail = () => {
  messageApi
    .getMessageDetail(messageId.value)
    .then((v) => {
      // 处理返回数据
      data.item = {
        ...v.data,
        ...v.data.bigv,
        pic_list:
          (v.data.pic_list && JSON.parse(v.data.pic_list.replace(/'/g, '"'))) ||
          []
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

// 格式化时间的函数
const formatTime = (time: string) => {
  return proxy.$dayjs(time).fromNow()
}

onLoad((option) => {
  messageId.value = option.id && Number(option.id)
  queryMessageDetail()
})
</script>

<style lang="scss" scoped>
.message-detail {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.info-text {
  flex: 1;
  font-size: 14px;
}

.time {
  color: #888;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 10px 0;
}

.message-content {
  margin-top: 8px;
  .content-img {
    height: 100%;
    object-fit: contain;
  }
}

.original-link {
  margin-top: 80px;
  text-align: left;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}
</style>
