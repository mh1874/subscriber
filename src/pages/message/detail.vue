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
      <u-button
        class="font-bold"
        type="warning"
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
      <text class="text-green-400 font-bold">分享至新用户得会员。</text>
    </view>
    <!-- 广告位 -->
    <view class="video-ads">
      <ad
        unit-id="adunit-a14400ba0fcf7663"
        ad-type="video"
        ad-theme="white"
        object-fit="contain"
      ></ad>
    </view>
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
import { useUpgradeModal } from '@/hooks/useUpgradeModal'
import UpgradeModal from '@/components/upgradeModal.vue'
import {
  getCurrentPageInfo,
  appendQueryParams,
  extractImagesFromHTML
} from '@/utils/util'

const { proxy } = getCurrentInstance()

const messageId = ref<number>(0)
const data = reactive({ item: { pic_list: [] } })

// 判断推送次数是否已用完 & 分享增加会员天数
const [register, { modalOptions, getUserInfo, addMemberDays }] =
  useUpgradeModal()

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
  // 判断推送次数是否已用完
  getUserInfo()
})

onShow(() => {
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

.video-ads {
  margin: 50px 0;
}

.back-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.6)
  );
  animation: gradientAnimation 10s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
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
