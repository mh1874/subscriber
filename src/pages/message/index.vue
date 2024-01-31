<template>
  <mescroll-uni
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="scrollOptions.up"
    :down="scrollOptions.down"
  >
    <view class="message-list">
      <view class="mb-2" @click="toAbout">
        <u-notice-bar
          font-size="20rpx"
          mode="vertical"
          :duration="3000"
          type="warning"
          more-icon
          :list="noticeList"
        ></u-notice-bar>
      </view>
      <message-item
        v-for="item in data.tableData"
        :key="item.mes_id"
        :item="item"
      ></message-item>
    </view>
  </mescroll-uni>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onPageScroll, onReachBottom, onLoad, onShow } from '@dcloudio/uni-app'
import useMescroll from '@/uni_modules/mescroll-uni/hooks/useMescroll.js'
import { messageApi, mineApi } from '@/api'
import { shouldExpandContent, extractImagesFromHTML } from '@/utils/util'
import MessageItem from '@/components/MessageItem'

const { mescrollInit, downCallback, getMescroll } = useMescroll(
  onPageScroll,
  onReachBottom
)

const data = reactive({ tableData: [], totalSize: 0 })

const scrollOptions = reactive({
  up: { use: true, offset: 50, textNoMore: '-- 到底了 --' },
  down: { use: true }
})

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
const noticeList = ['秒级响应、极速推送，关于秒速球']
// 跳转我的-关于页面
const toAbout = () => {
  uni.navigateTo({ url: '/pages/mine/detail/about' })
}

// 接收分享参数相关
const shareId = ref(null)
const addNoticeNum = () => {
  mineApi.addNoticeNum({ source_user_id: shareId.value })
}

const canReset = ref(false)
onLoad((option) => {
  if (canReset.value) {
    getMescroll().resetUpScroll() // 重置列表数据为第一页
    getMescroll().scrollTo(0, 0)
  }
  canReset.value = true
  if (option.shareId) {
    shareId.value = option.shareId && Number(option.shareId)
    addNoticeNum()
  }
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
</style>
