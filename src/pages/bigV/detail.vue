<template>
  <mescroll-uni
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="scrollOptions.up"
    :down="scrollOptions.down"
  >
    <view class="bigV-list">
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
import MessageItem from '@/components/messageItem.vue'
import { shouldExpandContent, extractImagesFromHTML } from '@/utils/util'
import { messageApi } from '@/api'

const { mescrollInit, downCallback } = useMescroll(onPageScroll, onReachBottom)

const bigVId = ref<number>(0)
const data = reactive({ tableData: [], totalSize: 0 })

const scrollOptions = reactive({
  up: { use: true, offset: 50, textNoMore: '-- 到底了 --' },
  down: { use: true }
})

// 上拉加载的回调: 其中num:当前页 从1开始, size:每页数据条数,默认10
const upCallback = (mescroll: any) => {
  messageApi
    .getMessageListFromBigV({
      bigv_id: bigVId.value,
      count: mescroll.size,
      offset: (mescroll.num - 1) * 10
    })
    .then((res) => {
      if (res.status !== 1) return
      const curPageData =
        res.data.map((it: any) => {
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
      data.tableData = data.tableData.concat(curPageData) // 追加新数据
      data.totalSize = res.total_size

      mescroll.endBySize(curPageData.length, data.totalSize) // 必传参数(当前页的数据个数, 总数据量)
      mescroll.endSuccess(curPageData.length) // 请求成功, 结束加载
    })
    .catch(() => {
      mescroll.endErr() // 请求失败, 结束加载
    })
}

onLoad((option: any) => {
  bigVId.value = option.id && Number(option.id)
})

onShow(() => {
  uni.$u.mpShare.path = ''
  uni.$u.mpShare.imageUrl = ''
})
</script>

<style scoped lang="scss">
.bigV-list {
  background-color: #f0f0f0;
  padding: 10px 0;
}
</style>
