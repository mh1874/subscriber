<template>
  <mescroll-uni
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="scrollOptions.up"
    :down="scrollOptions.down"
  >
    <view class="message-list">
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
import { messageApi } from '@/api'
import MessageItem from '@/components/MessageItem'
import { estimateLineCount } from '@/utils/util'

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
          return {
            ...it,
            needExpand: estimateLineCount(it.message + it.retweeted_message),
            pic_list:
              (it.pic_list && JSON.parse(it.pic_list.replace(/'/g, '"'))) || []
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

const canReset = ref(false)

onLoad(() => {
  if (canReset.value) {
    getMescroll().resetUpScroll() // 重置列表数据为第一页
    getMescroll().scrollTo(0, 0)
  }
  canReset.value = true
})

onShow(() => {
  uni.$u.mpShare.path = ''
  uni.$u.mpShare.imageUrl = ''
})
</script>

<style scoped lang="scss">
.message-list {
  background-color: #f0f0f0;
  padding: 10px 0;
}
</style>
