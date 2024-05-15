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
        <view class="mb-2" @click="toActivity">
          <u-notice-bar
            font-size="20rpx"
            mode="vertical"
            :duration="3000"
            type="warning"
            more-icon
            :list="noticeList"
          ></u-notice-bar>
        </view>
        <view v-for="(item, index) in data.tableData" :key="item.mes_id">
          <message-item :item="item"></message-item>
          <view class="ads-content" v-if="isAdsHandler(index + 1)">
            <ad-custom :unit-id="showRandomAds()" ad-intervals="30"></ad-custom>
          </view>
        </view>
      </view>
    </mescroll-uni>
    <!-- 推送次数提示弹窗 -->
    <upgrade-modal ref="upgradeModalRef" :options="modalOptions" />
    <!-- 添加到我的小程序提示 -->
    <add-prompt />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  onPageScroll,
  onReachBottom,
  onLoad,
  onHide,
  onShow
} from '@dcloudio/uni-app'
import useMescroll from '@/uni_modules/mescroll-uni/hooks/useMescroll.js'
import { messageApi, mineApi } from '@/api'
import { shouldExpandContent, extractImagesFromHTML } from '@/utils/util'
import { useUserStore } from '@/store'
import AddPrompt from '@/components/addPrompt.vue'
import UpgradeModal from '@/components/upgradeModal.vue'
import MessageItem from '@/components/messageItem.vue'
import vipIcon from '@/static/member/vip.png'
import svipIcon from '@/static/member/svip.png'

const { mescrollInit, downCallback, getMescroll } = useMescroll(
  onPageScroll,
  onReachBottom
)

const userStore = useUserStore()
const data = reactive<{ tableData: any; totalSize: number }>({
  tableData: [],
  totalSize: 0
})
const upgradeModalRef = ref<HTMLElement | null>(null)
const modalOptions = ref({
  title: '温馨提示',
  content: '今日推送次数已用完，分享、观看广告、升级 限时送会员！'
})

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

// 判断插入广告的位置 第二条之后每三条插入一次
const isAdsHandler = (index: number) => {
  return index === 2 || (index > 3 && (index - 2) % 3 === 0)
}
const adsMap = [
  'adunit-b4d82eba4ee15afd',
  'adunit-f334561c7129680f',
  'adunit-e824aaeca0e5c667',
  'adunit-833ea18507e27b30',
  'adunit-16a6f5f1941e5437'
]
let adsCount = 0
// 顺序插入广告
const showRandomAds = () => {
  const ad = adsMap[adsCount]
  adsCount = (adsCount + 1) % adsMap.length
  return ad
}

// 上拉加载的回调: 其中num:当前页 从1开始, size:每页数据条数,默认10
const upCallback = async (mescroll: any) => {
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
            needExpand: shouldExpandContent(messageText),
            pic_list: picList
          }
        }) || [] // 当前页数据
      if (mescroll.num === 1) data.tableData = [] // 第一页需手动置空列表
      // data.tableData = data.tableData.concat(curPageData) // 追加新数据
      for (let i = 0; i < curPageData.length; i++) {
        const newItem = curPageData[i]
        const existingItemIndex = data.tableData.findIndex(
          (item: any) => item.mes_id === newItem.mes_id
        )
        if (existingItemIndex !== -1) {
          // 数据已存在，用新的数据替换旧的数据
          data.tableData[existingItemIndex] = newItem
        } else {
          // 数据不存在，追加新数据
          data.tableData.push(newItem)
        }
      }
      // insertAds()
      // console.log('data.tableData ==>', data.tableData)
      data.totalSize = res.total_size
      mescroll.endBySize(curPageData.length, data.totalSize) // 必传参数(当前页的数据个数, 总数据量)
      mescroll.endSuccess(curPageData.length) // 请求成功, 结束加载
    })
    .catch(() => {
      mescroll.endErr() // 请求失败, 结束加载
    })
}

// 滚动通知列表
const noticeList = ['多种方式享无限推送次数 🎉 🎉 🎉']
// 跳转活动页面
const toActivity = () => {
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
      upgradeModalRef.value && upgradeModalRef.value.openModal()
    }
  })
}

const canReset = ref(false)
onLoad(async (option: any) => {
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

onHide(() => {
  // 消息列表页面隐藏时关闭"添加我的小程序"提示
  uni.setStorageSync('PROMPT_FLAG', false)
})

onShow(() => {
  uni.$u.mpShare.path = ''
  uni.$u.mpShare.imageUrl = ''
})
</script>

<style lang="scss" scoped>
.message-list {
  background-color: #f0f0f0;
  padding-bottom: 5px;
}
.ads-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
