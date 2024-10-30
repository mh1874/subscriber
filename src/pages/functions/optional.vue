<template>
  <view>
    <mescroll-uni
      :up="scrollOptions.up"
      :down="scrollOptions.down"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
    >
      <view class="big-v-list">
        <view class="mb-2">
          <u-notice-bar
            mode="vertical"
            :duration="3000"
            type="warning"
            more-icon
            :list="noticeList"
          ></u-notice-bar>
        </view>
        <big-v
          mode="search"
          v-for="item in data.tableData"
          :key="item.bigv_id"
          :item="item"
          @follow="followHandler"
        ></big-v>
      </view>
    </mescroll-uni>
    <u-modal
      v-model="followModalFlag"
      :content="unFollowText"
      confirm-text="去关注"
      confirm-color="orange"
      @confirm="toReminder"
    ></u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { onPageScroll, onReachBottom, onShow } from '@dcloudio/uni-app'
import useMescroll from '@/uni_modules/mescroll-uni/hooks/useMescroll.js'
import { functionsApi, bigVApi } from '@/api'
import { useUserStore } from '@/store'
import { isEmpty } from '@/utils/util'
import BigV from '@/components/bigV.vue'

const userStore = useUserStore()
const { mescrollInit, downCallback, getMescroll } = useMescroll(
  onPageScroll,
  onReachBottom
)

const data = reactive<{ tableData: any; totalSize: number }>({
  tableData: [],
  totalSize: 0
})

// 滚动通知列表
const noticeList = ['实时掌握牛人自选动态，赢在抢跑 ~']

const scrollOptions = reactive({
  up: {
    use: true,
    offset: 50,
    textNoMore: '-- 到底了 --',
    empty: { use: true, btnText: '去订阅 ~ ' }
  },
  down: { use: true }
})

// 上拉加载的回调: 其中num:当前页 从1开始, size:每页数据条数,默认10
const upCallback = async (mescroll: any, offsetVal: any) => {
  await nextTick()
  const params = {
    count: mescroll.size,
    offset: isEmpty(offsetVal) ? (mescroll.num - 1) * 10 : offsetVal
  } as any
  functionsApi
    .getOptionalBigVList(params)
    .then((res) => {
      if (res.status !== 1) return
      const curPageData = res.data || [] // 当前页数据
      if (mescroll.num === 1) data.tableData = [] // 第一页需手动置空列表
      // data.tableData = data.tableData.concat(curPageData) // 追加新数据
      for (let i = 0; i < curPageData.length; i++) {
        const newItem = curPageData[i]
        const existingItemIndex = data.tableData.findIndex(
          (item: any) => item.bigv_id === newItem.bigv_id
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

const roundToNearestTen = (value: number) => {
  const base = 10
  return Math.floor(value / base) * base
}

/**
 * 牛人订阅or取消订阅
 * @param type 关注发帖1
 * @param item 牛人信息
 */
const followAction = (type: number, item: any) => {
  const apiFunc = item.is_follow_portfolio
    ? bigVApi.bigvUnFollow
    : bigVApi.bigvFollow
  const params = {
    bigv_id: item.bigv_id,
    type
  }
  apiFunc(params)
    .then((res) => {
      if (res.status !== 1) return
      uni.showToast({
        title: res.msg,
        icon: 'none'
      })
      const itemIndex = data.tableData.findIndex(
        (it: any) => it.bigv_id === item.bigv_id
      )
      const offsetVal = roundToNearestTen(itemIndex)
      upCallback(getMescroll(), offsetVal)
    })
    .catch((err) => {
      console.log(err)
    })
}

const followModalFlag = ref<boolean>(false)
const unFollowText = computed(() => userStore.unFollowText)
/**
 * 牛人订阅or取消订阅
 * @param type 关注发帖 1
 * @param item 牛人信息
 */
const followHandler = (type: number, item: any) => {
  if (!userStore.isFollowGZH) {
    bigVApi.isFollowGZH().then((res) => {
      if (res.status !== 1) return
      // status 0 未关注 status 1 已关注
      if (res.data === 1) {
        userStore.setFollowState(true)
        followAction(type, item)
      } else {
        followModalFlag.value = true
      }
    })
  } else {
    followAction(type, item)
  }
}
// 跳转我的-提醒设置
const toReminder = () => {
  uni.navigateTo({ url: '/pages/mine/detail/reminder' })
}

const canReset = ref(false)
onShow(() => {
  canReset.value = true
  uni.$u.mpShare.path = ''
  uni.$u.mpShare.imageUrl = ''
})
</script>

<style lang="scss" scoped>
.big-v-list {
  background-color: #f0f0f0;
}
</style>
