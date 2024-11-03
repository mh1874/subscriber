<template>
  <view class="message-detail">
    <view class="user-info">
      <image class="avatar" :src="data.item.avatar" mode="aspectFill"></image>
      <view class="flex-1">
        <view class="nick-name">{{ data.item.nick }}</view>
        <view class="time">{{
          formatTime(data.item.source_created_time)
        }}</view>
      </view>
      <u-button
        class="font-bold"
        type="success"
        plain
        size="mini"
        open-type="share"
      >
        <text>分享内容得会员</text>
        <u-icon name="arrow-rightward" size="24" class="ml-1"></u-icon>
      </u-button>
    </view>
    <view class="divider"></view>
    <view class="message-content">
      <view class="mb-1">
        <mp-html
          :copy-link="false"
          :preview-img="false"
          @linktap="copyLink"
          :content="data.item.message"
        />
      </view>
      <view v-if="data.item.retweeted_message" class="retweeted">
        <mp-html
          :copy-link="false"
          :preview-img="false"
          @linktap="copyLink"
          :content="data.item.retweeted_message"
        />
      </view>
      <!-- 自选类型消息可跳转自选详情 -->
      <view v-if="data.item.type === 3" class="mt-3" @click="toOptional">
        <text class="to-optional">查看最新自选>>></text>
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
      <text class="text-green-400 font-bold">分享至新用户得会员。</text>
    </view>
    <!-- 广告位 -->
    <template v-if="userStore.isNormalUser">
      <view class="video-ads">
        <ad
          unit-id="adunit-a14400ba0fcf7663"
          ad-type="video"
          ad-theme="white"
          object-fit="contain"
        ></ad>
      </view>
    </template>
    <view class="back-container">
      <u-button class="back-btn" type="success" size="default" @click="toHome">
        返回主页
      </u-button>
    </view>
    <UpgradeModal @register="register" :options="modalOptions" />
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, reactive, getCurrentInstance } from 'vue'
import { messageApi } from '@/api'
import { getUserId } from '@/api/token'
import { useUserStore } from '@/store'
import { useUpgradeModal } from '@/hooks/useUpgradeModal'
import { usePoZheng } from '@/hooks/usePoZheng'
import UpgradeModal from '@/components/upgradeModal.vue'
import {
  getCurrentPageInfo,
  appendQueryParams,
  extractImagesFromHTML
} from '@/utils/util'

const { proxy } = getCurrentInstance()
const userStore = useUserStore()

const messageId = ref<number>(0)
const data = reactive<any>({ item: { pic_list: [] } })

// 判断推送次数是否已用完 & 分享增加会员天数
const [register, { modalOptions, getUserInfo, addMemberDays }] =
  useUpgradeModal()

// 用于判断是否为外部链接 & 点击链接复制
const { isPoZheng, processText, copyLink } = usePoZheng()

const queryMessageDetail = () => {
  messageApi
    .getMessageDetail(messageId.value)
    .then((res) => {
      const { message, retweeted_message, pic_list, source_platform } = res.data
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
      // 判断内容是否来自破整网
      let messageResult = handledMessage
      let retweetedResult = handledRetweeted
      if (isPoZheng(source_platform)) {
        messageResult = processText(handledMessage)
        retweetedResult = `<span>原文链接（点击复制）: 
            <a style="color: #366092;">${handledRetweeted}</a>
           </span>`
      }
      // 处理返回数据
      data.item = {
        ...res.data,
        ...res.data.bigv,
        message: messageResult,
        retweeted_message: retweetedResult,
        pic_list: picList
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

// 跳转自选详情
const toOptional = () => {
  uni.navigateTo({
    url: `/pages/functions/optionalDetail?id=${data.item.bigv_id}`
  })
}

// 图片预览方法
const previewHandler = (url: string) => {
  uni.previewImage({
    current: url,
    urls: data.item.pic_list
  })
}

// 获取相对时间
const formatTime = (time: string) => {
  return proxy.$dayjs(time).fromNow()
}

// 返回主页
const toHome = () => {
  uni.switchTab({ url: '/pages/message/index' })
}

// 设置分享链接
const setShareUrl = () => {
  const pageInfo = getCurrentPageInfo()
  // 分享链接携带用户id
  const queryVal = { ...pageInfo.curQuery, shareId: getUserId() }
  const url = appendQueryParams(pageInfo.curRoute, queryVal)
  uni.$u.mpShare.path = url
}

onLoad(async (option: any) => {
  messageId.value = option.id && Number(option.id)
  queryMessageDetail()
  if (option.shareId) {
    addMemberDays(option.shareId)
  }
})

onShow(() => {
  // 判断推送次数是否已用完
  getUserInfo()
  setShareUrl()
  uni.$u.mpShare.imageUrl = ''
})
</script>

<style lang="scss" scoped>
.message-detail {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
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

.divider {
  height: 1px;
  background-color: #eee;
  margin: 10px 0;
}

.message-content {
  margin: 8px 0;
  font-size: 16px;
  line-height: 26px;
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
  .to-optional {
    color: #22c55e;
    border-bottom: 1px solid #22c55e;
  }
}

.copyright-tips {
  margin: 80px 0 50px;
  text-align: left;
  font-size: 14px;
  color: #333;
}

.video-ads {
  margin-bottom: 50px;
}

.back-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 140px;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.6)
  );
  animation: gradientAnimation 10s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  .back-btn {
    width: 80%;
    z-index: 999;
    box-shadow: 0 0 15px 0 rgba(4, 80, 43, 0.6);
    border-radius: 5px;
  }
}
@keyframes gradientAnimation {
  0%,
  100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
}
</style>
