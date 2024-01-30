<template>
  <view>
    <u-search
      trim
      clearable
      shape="square"
      class="search-input"
      search-icon-color="#3cc51f"
      border-color="#3cc51f"
      bg-color="#fff"
      :show-action="false"
      margin="10rpx 20rpx"
      v-model="searchVal"
      placeholder="搜索喜欢的牛人"
      @change="changeSearchVal"
      @focus="searchFocus"
      @clear="clearSearchVal"
    />
    <u-popup
      mode="top"
      z-index="1999"
      height="280px"
      v-model="searchAreaVisible"
      @close="closeSearchArea"
    >
      <scroll-view class="search-content" scroll-y="true">
        <template v-if="data.searchData.length">
          <big-v
            mode="search"
            v-for="item in data.searchData"
            :key="item.bigv_id"
            :item="item"
            @follow="(it) => followHandler('search', it)"
          ></big-v>
        </template>
        <template v-else>
          <u-empty class="empty-tips" :text="emptyOptions.text" mode="data">
            <template v-if="emptyOptions.noData" v-slot:bottom>
              <a class="feedback-btn" @click="handleFeedback">
                建议我们收录（优先处理会员建议）
              </a>
            </template>
          </u-empty>
        </template>
      </scroll-view>
    </u-popup>
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
          mode="bigV"
          v-for="item in data.tableData"
          :key="item.bigv_id"
          :item="item"
          @follow="(it) => followHandler('list', it)"
        ></big-v>
      </view>
    </mescroll-uni>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue'
import { onPageScroll, onReachBottom, onLoad, onShow } from '@dcloudio/uni-app'
import { bigVApi } from '@/api'
import BigV from '@/components/bigV.vue'
import useMescroll from '@/uni_modules/mescroll-uni/hooks/useMescroll.js'
import { isEmpty } from '@/utils/util'

const { mescrollInit, downCallback, getMescroll } = useMescroll(
  onPageScroll,
  onReachBottom
)

const data = reactive({ tableData: [], totalSize: 0, searchData: [] })

const scrollOptions = reactive({
  up: { use: true, offset: 50, textNoMore: '-- 到底了 --' },
  down: { use: true }
})

// tab部分
const currentTab = ref(0)
const tabList = reactive([
  {
    name: '我的订阅'
  },
  {
    name: '球球'
  },
  {
    name: '围脖'
  },
  {
    name: '冬菜'
  }
])

const changeTab = () => {
  getMescroll().resetUpScroll()
  getMescroll().scrollTo(0, 0)
}

// 搜索部分
const searchVal = ref('')
const searchTimer = ref(null)
const searchAreaVisible = ref(false)
const emptyOptions = reactive({
  noData: false,
  text: '请输入昵称搜索'
})

// 清空搜索值
const clearSearchVal = () => {
  emptyOptions.noData = false
  emptyOptions.text = '请输入昵称搜索'
  data.searchData = []
}
// 搜索请求
const bigVSearchHandler = () => {
  if (searchVal.value) {
    const params = {
      nick: searchVal.value,
      count: 5
    }
    bigVApi.searchBigVList(params).then((res) => {
      if (res.status !== 1) return
      if (res.data.length) {
        data.searchData = [...res.data]
      } else {
        data.searchData = []
        emptyOptions.noData = true
        emptyOptions.text = '-- 暂未收录 --'
      }
    })
  } else {
    clearSearchVal()
  }
}
// 搜索输入
const changeSearchVal = () => {
  searchTimer.value && clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    bigVSearchHandler()
  }, 300)
}
// 搜索框选中
const searchFocus = () => {
  searchAreaVisible.value = true
}
// 跳转反馈页面
const handleFeedback = () => {
  uni.navigateTo({
    url: '/pages/mine/detail/feedback'
  })
}
// 关闭搜索区域
const closeSearchArea = () => {
  searchVal.value = ''
  emptyOptions.noData = false
  emptyOptions.text = '请输入昵称搜索'
  data.searchData = []
}
// 关闭搜索区域时，刷新牛人数据
watch(searchAreaVisible, (value) => {
  if (!value) changeTab()
})

// 平台枚举
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

// type list 列表关注 search 搜索关注
const followAction = (type, item) => {
  const apiFunc = item.is_follow ? bigVApi.bigvUnFollow : bigVApi.bigvFollow
  apiFunc(item.bigv_id)
    .then((res) => {
      if (res.status !== 1) return
      uni.showToast({
        title: res.msg,
        icon: 'none'
      })
      if (type === 'list') {
        const itemIndex = data.tableData.findIndex(
          (it) => it.bigv_id === item.bigv_id
        )
        const offsetVal = roundToNearestTen(itemIndex)
        upCallback(getMescroll(), offsetVal)
      } else {
        bigVSearchHandler()
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

// 牛人订阅or取消订阅
const followHandler = (type, item) => {
  if (!item.is_follow) {
    // TODO: deadline 20240130 小程序审核通过后，更换为长期模板的id
    // uni.requestSubscribeMessage({
    //   tmplIds: ['9tsp0RZWS7Fq-K6tOuE7OTbJbDa9zjSUQtMErs_Tu9Y'],
    //   success: () => {
    followAction(type, item)
    //   },
    //   fail: () => {
    //     console.log('request Subscribe error ==>')
    //   }
    // })
  } else {
    followAction(type, item)
  }
}

const canReset = ref(false)

onLoad(() => {
  if (canReset.value) {
    changeTab()
  }
  canReset.value = true
})

onShow(() => {
  uni.$u.mpShare.path = ''
  uni.$u.mpShare.imageUrl = ''
})
</script>

<style lang="scss" scoped>
.big-v-list {
  background-color: #f0f0f0;
}

.search-input {
  z-index: 3000;
}

.search-content {
  height: 100%;
  .empty-tips {
    display: flex;
    align-content: center;
    justify-content: center;
    height: 100%;
    .feedback-btn {
      margin-top: 8px;
      color: #333;
      text-decoration: underline;
    }
  }
}

::v-deep .u-drawer {
  top: 45px !important;
  .u-mask {
    top: 45px;
  }
}
</style>
