<template>
  <view>
    <u-search
      trim
      clearable
      shape="square"
      search-icon-color="#3cc51f"
      border-color="#3cc51f"
      bg-color="#fff"
      :show-action="false"
      margin="10rpx 20rpx"
      v-model="searchVal"
      placeholder="搜索喜欢的牛人"
      @change="changeSearchVal"
      @blur="searchBlur"
    />
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
      :top="180"
      :up="scrollOptions.up"
      :down="scrollOptions.down"
    >
      <view class="big-v-list">
        <big-v
          v-for="item in data.tableData"
          :key="item.bigv_id"
          :item="item"
          @follow="followHandler"
        ></big-v>
      </view>
    </mescroll-uni>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { onPageScroll, onReachBottom, onLoad, onShow } from '@dcloudio/uni-app'
import { bigVApi } from '@/api'
import BigV from '@/components/bigV.vue'
import useMescroll from '@/uni_modules/mescroll-uni/hooks/useMescroll.js'
import { isEmpty } from '@/utils/util'

const { mescrollInit, downCallback, getMescroll } = useMescroll(
  onPageScroll,
  onReachBottom
)

const data = reactive({ tableData: [], totalSize: 0 })

const scrollOptions = reactive({
  up: { use: true, offset: 50, textNoMore: '-- 到底了 --' },
  down: { use: true }
})

const searchVal = ref('')
const searchTimer = ref(null)

const bigVSearchHandler = () => {
  if (searchVal.value) {
    const params = {
      nick: searchVal.value,
      count: 5
    }
    bigVApi.searchBigVList(params).then((res) => {
      if (res.status !== 1) return
      if (res.data.length) {
        data.tableData = [...res.data, ...data.tableData]
        getMescroll().endSuccess(data.tableData.length)
      } else {
        data.tableData = []
        getMescroll().endSuccess(0) // 请求成功, 结束加载
      }
    })
  } else {
    getMescroll().resetUpScroll()
  }
}
// 输入监听
const changeSearchVal = () => {
  searchTimer.value && clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    bigVSearchHandler()
  }, 300)
}
// 失焦判断
const searchBlur = () => {
  searchVal.value = ''
  getMescroll().resetUpScroll()
}

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
  1: 'xueqiu',
  2: 'weibo',
  3: 'dongcai'
}

// 上拉加载的回调: 其中num:当前页 从1开始, size:每页数据条数,默认10
const upCallback = async (mescroll, offsetVal) => {
  await nextTick()
  const apiFunc =
    currentTab.value === 0 ? bigVApi.getFollowedBigVList : bigVApi.getBigVList
  const params = {
    count: mescroll.size,
    offset: isEmpty(offsetVal) ? (mescroll.num - 1) * 10 : offsetVal
  }
  if (currentTab.value !== 0) {
    params.source_platform = platformEnum[currentTab.value]
  }
  apiFunc(params)
    .then((res) => {
      if (res.status !== 1) return
      const curPageData = res.data || [] // 当前页数据
      if (mescroll.num === 1) data.tableData = [] // 第一页需手动置空列表
      // data.tableData = data.tableData.concat(curPageData) // 追加新数据
      for (let i = 0; i < curPageData.length; i++) {
        const newItem = curPageData[i]
        const existingItemIndex = data.tableData.findIndex(
          (item) => item.bigv_id === newItem.bigv_id
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

const roundToNearestTen = (number) => {
  const base = 10
  return Math.floor(number / base) * base
}

const followAction = (item) => {
  const apiFunc = item.is_follow ? bigVApi.bigvUnFollow : bigVApi.bigvFollow
  apiFunc(item.bigv_id)
    .then((res) => {
      if (res.status !== 1) return
      uni.showToast({
        title: res.msg,
        icon: 'none'
      })
      const itemIndex = data.tableData.findIndex(
        (it) => it.bigv_id === item.bigv_id
      )
      const offsetVal = roundToNearestTen(itemIndex)
      upCallback(getMescroll(), offsetVal)
    })
    .catch((err) => {
      console.log(err)
    })
}

// 牛人订阅or取消订阅
const followHandler = (item) => {
  if (!item.is_follow) {
    uni.requestSubscribeMessage({
      tmplIds: ['9tsp0RZWS7Fq-K6tOuE7OTbJbDa9zjSUQtMErs_Tu9Y'],
      success: () => {
        followAction(item)
      },
      fail: () => {
        console.log('request Subscribe error ==>')
      }
    })
  } else {
    followAction(item)
  }
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
.big-v-list {
  background-color: #f0f0f0;
}
</style>
