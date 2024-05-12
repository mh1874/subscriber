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
        分享内容
      </u-button>
    </view>
    <view class="divider"></view>
    <view class="message-content">
      <view class="mb-1">
        <mp-html
          :copy-link="false"
          :preview-img="false"
          :content="data.item.message"
        />
      </view>
      <view v-if="data.item.retweeted_message" class="retweeted">
        <mp-html
          :copy-link="false"
          :preview-img="false"
          :content="data.item.retweeted_message"
        />
      </view>
      <template v-if="data.item.pic_list.length">
        <view class="img-container">
          <view
            class="img-item"
            v-for="(it, index) in data.item.pic_list"
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
    </view>
    <view class="copyright-tips">
      <text>内容版权归原作者或组织，</text>
      <text class="text-green-400 font-bold">分享至新用户得推送次数。</text>
    </view>
    <!-- 广告位 -->
    <view class="my-10">
      <!-- <ad unit-id="adunit-014fc7e4ff1c50dc"></ad> -->
      <ad
        unit-id="adunit-a14400ba0fcf7663"
        ad-type="video"
        ad-theme="white"
      ></ad>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, reactive, getCurrentInstance } from 'vue'
import { messageApi, mineApi } from '@/api'
import { getUserId } from '@/api/token'
import {
  getCurrentPageInfo,
  appendQueryParameters,
  extractImagesFromHTML
} from '@/utils/util'

const { proxy } = getCurrentInstance()

const messageId = ref<number>(0)
const data = reactive({ item: { pic_list: [] } })

const queryMessageDetail = () => {
  messageApi
    .getMessageDetail(messageId.value)
    .then((res) => {
      const { message, retweeted_message, pic_list } = res.data
      const { text: handledMessage, picList: messagePicList } =
        extractImagesFromHTML(message)
      const { text: handledRetweeted, picList: retweetedPicList } = res.data
        .retweeted_message
        ? extractImagesFromHTML(retweeted_message)
        : { text: '', picList: [] }
      const picList = [
        ...((pic_list && JSON.parse(pic_list.replace(/'/g, '"'))) || []),
        ...messagePicList,
        ...retweetedPicList
      ]
      // 处理返回数据
      data.item = {
        ...res.data,
        ...res.data.bigv,
        message: handledMessage,
        retweeted_message: handledRetweeted,
        pic_list: picList
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

// 图片预览方法
const previewHandler = (url: string) => {
  uni.previewImage({
    current: url,
    urls: data.item.pic_list
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

onLoad((option: any) => {
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
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .info-text {
    flex: 1;
    font-size: 15px;
  }
  .time {
    color: #888;
    font-size: 12px;
  }
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 10px 0;
}

.message-content {
  margin: 8px 0;
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
  .retweeted {
    padding: 15px 10px;
    background-color: #f7f7f7;
  }
}

.copyright-tips {
  margin-top: 80px;
  text-align: left;
  font-size: 13px;
  color: #333;
}
</style>
