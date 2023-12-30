<template>
  <view class="message-detail">
    <view class="user-info">
      <image class="avatar" :src="data.item.avatar" mode="aspectFill"></image>
      <view class="info-text">
        <view class="font-bold">{{ data.item.nick }}</view>
        <view class="time">{{ formatTime(data.item.modified_time) }}</view>
      </view>
      <u-button type="success" plain size="mini">分享信息</u-button>
    </view>
    <view class="divider"></view>
    <view class="message-content">
      <text class="message-text">{{ data.item.message }}</text>
    </view>
    <view class="original-link">
      <view>本文版权属于原作者或组织</view>
      <view>原文地址：{{ data.item.original_link }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, reactive, getCurrentInstance } from 'vue'
// import { homeApi } from '@/api'
import { messageList } from '../index/mock'

const { proxy } = getCurrentInstance()

const messageId: number = ref(0)
const data = reactive({ item: [] })

const queryMessageDetail = () => {
  data.item = messageList.find((it) => it.mes_id === messageId.value)
  // 请求backend获取数据
  // homeApi
  //   .getSubscribedList(0)
  //   .then((v) => {
  //     // 处理返回数据
  //     data.tableData = v.data
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
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
  margin-top: 10px;
  .message-text {
    word-break: break-all;
  }
}

.original-link {
  margin-top: 80px;
  text-align: left;
}
</style>
