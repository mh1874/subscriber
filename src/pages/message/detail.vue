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
      <u-button type="success" plain size="mini" open-type="share">
        分享信息
      </u-button>
    </view>
    <view class="divider"></view>
    <view class="message-content">
      <view class="mb-1">
        <mp-html :copy-link="false" :content="data.item.message" />
      </view>
      <view v-if="data.item.retweeted_message" class="retweeted">
        <mp-html :copy-link="false" :content="data.item.retweeted_message" />
      </view>
      <div class="content-img" v-if="data.item.pic_list.length">
        <image
          v-for="(img, index) in data.item.pic_list"
          :key="index"
          :src="img"
        ></image>
      </div>
    </view>
    <view class="copyright-tips">
      <view>本文内容版权归原作者或相关组织所有。</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, reactive, getCurrentInstance } from 'vue'
import { messageApi, mineApi } from '@/api'
import { getUserId } from '@/api/token'
import { getCurrentPageInfo, appendQueryParameters } from '@/utils/util'

const { proxy } = getCurrentInstance()

const messageId: number = ref(0)
const data = reactive({ item: { pic_list: [] } })

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

// 接收分享参数相关
const shareId = ref(null)
const addNoticeNum = () => {
  mineApi.addNoticeNum({ source_user_id: shareId.value })
}

// 设置分享链接
const setShareUrl = () => {
  const pageInfo = getCurrentPageInfo()
  // 分享链接携带用户id
  const queryVal = { ...pageInfo.curQuery, shareId: getUserId() }
  const url = appendQueryParameters(pageInfo.curRoute, queryVal)
  uni.$u.mpShare.path = url
}

onLoad((option) => {
  messageId.value = option.id && Number(option.id)
  queryMessageDetail()
  if (option.shareId) {
    shareId.value = option.shareId && Number(option.shareId)
    addNoticeNum()
  }
})

onShow(() => {
  setShareUrl()
  uni.$u.mpShare.imageUrl = ''
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
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 10px 0;
}

.message-content {
  margin: 8px 0;
  .content-img {
    background-size: contain;
  }
  .retweeted {
    padding: 15px 10px;
    background-color: #f7f7f7;
  }
}

.copyright-tips {
  margin-top: 80px;
  text-align: left;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}
</style>
