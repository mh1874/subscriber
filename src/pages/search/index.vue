<template>
  <view>
    <u-tabs
      :list="tabList"
      :is-scroll="false"
      active-color="#59c272"
      v-model="currentTab"
      @change="changeTab"
    ></u-tabs>
    <mescroll-uni
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
      :top="100"
      :up="scrollOptions.up"
      :down="scrollOptions.down"
    >
      <view class="big-v-list">
        <big-v
          v-for="item in data.tableData"
          :key="item.bigv_id"
          :item="item"
        ></big-v>
      </view>
    </mescroll-uni>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { onPageScroll, onReachBottom, onShow } from '@dcloudio/uni-app'
import { searchApi } from '@/api'
// import { bigvs } from '../index/mock'
import BigV from '@/components/bigV.vue'
import useMescroll from '@/uni_modules/mescroll-uni/hooks/useMescroll.js'

const { mescrollInit, downCallback, getMescroll } = useMescroll(
  onPageScroll,
  onReachBottom
)

const data = reactive({ tableData: [], totalSize: 0 })

const scrollOptions = reactive({
  up: { use: true, textNoMore: '-- 到底了 --' },
  down: { use: true }
})

const currentTab = ref(0)

const tabList = reactive([
  {
    name: '我的订阅'
  },
  {
    name: '雪球'
  },
  {
    name: '微博'
  },
  {
    name: '东财'
  }
])

const changeTab = () => {
  getMescroll().resetUpScroll()
}

const platformEnum = {
  1: 'xq',
  2: 'wb',
  3: 'dc'
}

// 上拉加载的回调: 其中num:当前页 从1开始, size:每页数据条数,默认10
const upCallback = async (mescroll) => {
  await nextTick()
  const apiFunc =
    currentTab.value === 0
      ? searchApi.getFollowedBigVList
      : searchApi.getBigVList
  const params = {
    count: mescroll.size,
    offset: (mescroll.num - 1) * 10
  }
  if (currentTab.value !== 0) {
    params.platform = platformEnum[currentTab.value]
  }
  setTimeout(() => {
    apiFunc(1, params)
      .then((res) => {
        if (res.status !== 1) return
        const curPageData = res.data || [] // 当前页数据
        if (mescroll.num === 1) data.tableData = [] // 第一页需手动置空列表
        data.tableData = data.tableData.concat(curPageData) // 追加新数据
        data.totalSize = res.total_size

        mescroll.endBySize(curPageData.length, data.totalSize) // 必传参数(当前页的数据个数, 总数据量)

        mescroll.endSuccess(curPageData.length) // 请求成功, 结束加载
      })
      .catch(() => {
        mescroll.endErr() // 请求失败, 结束加载
      })
  }, 300)
}

const canReset = ref(false)

onShow(() => {
  if (canReset.value) {
    getMescroll().resetUpScroll() // 重置列表数据为第一页
    getMescroll().scrollTo(0, 0)
  }
  canReset.value = true
})
</script>

<style scoped lang="scss">
.big-v-list {
  background-color: #f0f0f0;
}
</style>
