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
    <upgrade-modal @register="register" :options="modalOptions" />
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
import { messageApi } from '@/api'
import { shouldExpandContent, extractImagesFromHTML } from '@/utils/util'
import { setStorage } from '@/utils/storage'
import AddPrompt from '@/components/addPrompt.vue'
import { useUpgradeModal } from '@/hooks/useUpgradeModal'
import UpgradeModal from '@/components/upgradeModal.vue'
import MessageItem from '@/components/messageItem.vue'

const { mescrollInit, downCallback, getMescroll } = useMescroll(
  onPageScroll,
  onReachBottom
)

const data = reactive<{ tableData: any; totalSize: number }>({
  tableData: [],
  totalSize: 0
})

const scrollOptions = reactive({
  up: {
    use: true,
    offset: 50,
    textNoMore: '-- 到底了 --',
    empty: {
      use: true,
      tip: '点击下方“订阅”按钮，关注喜欢的牛人，即可在微信上实时收取牛人发帖、评论。',
      btnText: ' + 去订阅'
    }
  },
  down: { use: true }
})

// 判断推送次数是否已用完 & 分享增加会员天数
const [register, { modalOptions, getUserInfo, addMemberDays }] =
  useUpgradeModal()

// 去牛人页面关注
const toBigV = () => {
  uni.setStorage({
    key: 'bigVTabVal',
    data: 0
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
  'adunit-833ea18507e27b30',
  'adunit-16a6f5f1941e5437'
]
// 乱序插入广告
const showRandomAds = () => {
  const randomIndex = Math.floor(Math.random() * adsMap.length)
  return adsMap[randomIndex]
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
      data.totalSize = res.total_size
      mescroll.endBySize(curPageData.length, data.totalSize) // 必传参数(当前页的数据个数, 总数据量)
      mescroll.endSuccess(curPageData.length) // 请求成功, 结束加载
    })
    .catch(() => {
      mescroll.endErr() // 请求失败, 结束加载
    })
}

// 滚动通知列表
const noticeList = ['多种方式享无限推送次数 ~ ']
// 跳转活动页面
const toActivity = () => {
  uni.navigateTo({ url: '/pages/mine/detail/activity' })
}

const canReset = ref(false)
onLoad(async (option: any) => {
  if (canReset.value) {
    getMescroll().resetUpScroll()
    getMescroll().scrollTo(0, 0)
  }
  canReset.value = true
  if (option.shareId) {
    await addMemberDays(option.shareId)
  }
})

onHide(() => {
  // 消息列表页面隐藏时关闭"添加我的小程序"提示
  setStorage('PROMPT_FLAG', false)
})

onShow(() => {
  // 判断推送次数是否已用完
  getUserInfo()
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
