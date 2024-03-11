<template>
  <view>
    <mescroll-uni
      :up="scrollOptions.up"
      :down="scrollOptions.down"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
      @emptyclick="toBigV"
    >
      <view class="message-list">
        <view class="mb-2" @click="toAbout">
          <u-notice-bar
            font-size="20rpx"
            mode="vertical"
            :duration="3000"
            type="error"
            more-icon
            :list="noticeList"
          ></u-notice-bar>
        </view>
        <message-item
          v-for="item in data.tableData"
          :key="item.mes_id"
          :item="item"
          @preview="previewHandler"
        ></message-item>
      </view>
      <!-- 推送次数提示弹窗 -->
      <u-modal
        v-model="tipModalVisible"
        :title="modalOptions.title"
        :content="modalOptions.content"
        :mask-close-able="true"
      >
        <template v-slot:confirm-button>
          <view class="modal-btns">
            <button class="share-btn" plain @click="toUpgrade">去升级</button>
            <button class="share-btn" plain open-type="share">去分享</button>
          </view>
        </template>
      </u-modal>
    </mescroll-uni>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onPageScroll, onReachBottom, onLoad, onShow } from '@dcloudio/uni-app'
import useMescroll from '@/uni_modules/mescroll-uni/hooks/useMescroll.js'
import { messageApi, mineApi } from '@/api'
import { shouldExpandContent, extractImagesFromHTML } from '@/utils/util'
import MessageItem from '@/components/MessageItem'
import { useUserStore } from '@/store'
import vipIcon from '@/static/member/vip.png'
import svipIcon from '@/static/member/svip.png'

const { mescrollInit, downCallback, getMescroll } = useMescroll(
  onPageScroll,
  onReachBottom
)

const userStore = useUserStore()
const data = reactive({ tableData: [], totalSize: 0 })

const scrollOptions = reactive({
  up: {
    use: true,
    offset: 50,
    textNoMore: '-- 到底了 --',
    empty: { use: true, btnText: '去订阅 ~ ' }
  },
  down: { use: true }
})

// 去牛人页面关注
const toBigV = () => {
  uni.setStorage({
    key: 'bigVTabVal',
    data: 1
  })
  uni.switchTab({ url: '/pages/bigV/index' })
}

// 上拉加载的回调: 其中num:当前页 从1开始, size:每页数据条数,默认10
const upCallback = async (mescroll) => {
  messageApi
    .getMessageListFromUser({
      count: mescroll.size,
      offset: (mescroll.num - 1) * 10
    })
    .then((res) => {
      if (res.status !== 1) return
      const curPageData =
        res.data.map((it) => {
          const { text: messageText, picList: messagePicList } =
            extractImagesFromHTML(it.message)
          const { text: retweetedText, picList: retweetedPicList } =
            it.retweeted_message
              ? extractImagesFromHTML(it.retweeted_message)
              : { text: '', picList: [] }
          // 最多显示9张
          const picList = [
            ...((it.pic_list && JSON.parse(it.pic_list.replace(/'/g, '"'))) ||
              []),
            ...messagePicList,
            ...retweetedPicList
          ].slice(0, 9)
          return {
            ...it,
            message: messageText,
            retweeted_message: retweetedText,
            needExpand: shouldExpandContent(messageText, picList),
            pic_list: picList
          }
        }) || [] // 当前页数据
      if (mescroll.num === 1) data.tableData = [] // 第一页需手动置空列表
      // data.tableData = data.tableData.concat(curPageData) // 追加新数据
      for (let i = 0; i < curPageData.length; i++) {
        const newItem = curPageData[i]
        const existingItemIndex = data.tableData.findIndex(
          (item) => item.mes_id === newItem.mes_id
        )
        if (existingItemIndex !== -1) {
          // 数据已存在，用新的数据替换旧的数据
          data.tableData[existingItemIndex] = newItem
        } else {
          // 数据不存在，追加新数据
          data.tableData.push(newItem)
        }
      }
      data.totalSize = res.total_size

      mescroll.endBySize(curPageData.length, data.totalSize) // 必传参数(当前页的数据个数, 总数据量)
      mescroll.endSuccess(curPageData.length) // 请求成功, 结束加载
    })
    .catch(() => {
      mescroll.endErr() // 请求失败, 结束加载
    })
}

// 滚动通知列表
const noticeList = ['限时邀请新用户，送会员啦！']
// 跳转我的-活动页面
const toAbout = () => {
  uni.navigateTo({ url: '/pages/mine/detail/activity' })
}

// 接收分享参数相关
const shareId = ref(null)
const addNoticeNum = () => {
  mineApi.addNoticeNum({ source_user_id: shareId.value })
}

// 用户信息请求 & 判断推送次数是否已用完
const userLevelEnum = {
  2: vipIcon,
  3: svipIcon
}
const tipModalVisible = ref(true)
// 今日推送次数已用完，分享、升级得推送次数。
const modalOptions = {
  title: '温馨提示',
  content: '今日推送次数已用完，分享、升级限时送会员！'
}
const getUserInfo = () => {
  mineApi.getUserInfo().then(({ status, data: userData }) => {
    if (status !== 1) return
    const userInfo = {
      avatar: 'https://www.lovecf.cn/app/logo.png',
      userName: '秒速球',
      userId: userData.user_id,
      freeNoticeNum: userData.notice_num_free,
      rewardNoticeNum: userData.notice_num_reward,
      userLevel: userData.user_level,
      memberIcon: userLevelEnum[userData.user_level],
      expireDate: userData.user_level_expire_date
    }
    userStore.setUserInfo(userInfo)
    if (userInfo.freeNoticeNum + userInfo.rewardNoticeNum === 0) {
      tipModalVisible.value = true
      // 分享链接携带用户id
      uni.$u.mpShare.path = `/pages/message/index?shareId=${userInfo.userId}`
      uni.$u.mpShare.imageUrl = 'https://www.lovecf.cn/app/share.png'
    }
  })
}
// 去升级
const toUpgrade = () => {
  uni.navigateTo({ url: '/pages/mine/detail/member' })
}

const canReset = ref(false)
// 预览时无需触发onShow
const previewHandler = () => {
  canReset.value = false
}

onLoad(async (option) => {
  if (canReset.value) {
    getMescroll().resetUpScroll()
    getMescroll().scrollTo(0, 0)
  }
  canReset.value = true
  if (option.shareId) {
    shareId.value = option.shareId && Number(option.shareId)
    await addNoticeNum()
  }
  // 判断推送次数是否已用完
  getUserInfo()
})

onShow(() => {
  uni.$u.mpShare.path = ''
  uni.$u.mpShare.imageUrl = ''
})
</script>

<style lang="scss" scoped>
.message-list {
  background-color: #f0f0f0;
  padding-bottom: 10px;
}
.modal-btns {
  display: flex;
  height: 100%;
  .share-btn {
    flex: 1;
    padding: 0;
    border: none;
    border-radius: 0;
    line-height: 50px;
    font-size: 15px;
    font-weight: 700;
    color: $main-color;
    text-align: center;
  }
  .share-btn:first-child {
    border-right: 1px solid #e5e5e5;
  }
}
</style>
