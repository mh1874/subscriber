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
      duration="200"
      border-radius="14"
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
            @follow="(type, it) => followHandler('search', type, it)"
          ></big-v>
        </template>
        <template v-else>
          <u-empty class="empty-tips" :text="emptyOptions.text" mode="data">
            <template v-if="emptyOptions.noData" v-slot:bottom>
              <a class="feedback-btn" @click="handleFeedback"> 建议我们收录 </a>
            </template>
          </u-empty>
        </template>
      </scroll-view>
    </u-popup>
    <mescroll-uni
      :top="80"
      :up="scrollOptions.up"
      :down="scrollOptions.down"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
      @emptyclick="toFollow"
    >
      <!-- 常用功能 -->
      <common-functions />
      <view class="sticky-tabs">
        <u-tabs
          :list="tabList"
          :is-scroll="false"
          active-color="#59c272"
          v-model="currentTab"
          @change="changeTab"
        ></u-tabs>
      </view>
      <view class="big-v-list">
        <big-v
          mode="bigV"
          v-for="item in data.tableData"
          :key="item.bigv_id"
          :item="item"
          @follow="(type, it) => followHandler('list', type, it)"
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
import { ref, reactive, nextTick, watch, computed } from 'vue'
import { onPageScroll, onReachBottom, onLoad, onShow } from '@dcloudio/uni-app'
import useMescroll from '@/uni_modules/mescroll-uni/hooks/useMescroll.js'
import { bigVApi } from '@/api'
import { useUserStore } from '@/store'
import { isEmpty } from '@/utils/util'
import { Nullable, TimeoutHandle } from '@/types'
import BigV from '@/components/bigV.vue'
import CommonFunctions from './commonFunctions.vue'

const userStore = useUserStore()
const { mescrollInit, downCallback, getMescroll } = useMescroll(
  onPageScroll,
  onReachBottom
)

const data = reactive<{ tableData: any; totalSize: number; searchData: any }>({
  tableData: [],
  totalSize: 0,
  searchData: []
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

// tab部分
const currentTab = ref<number>(0)
const tabList = reactive([
  { name: '球球' },
  { name: '围脖' },
  { name: '冬菜' },
  { name: '我的' }
])
// 平台参数枚举
const platformEnum = {
  0: 'xueqiu',
  1: 'weibo',
  2: 'dongcai'
}

// 是否为 “我的订阅” Tab
const isMineTab = computed(() => currentTab.value === 3)

const changeTab = () => {
  getMescroll().resetUpScroll()
  getMescroll().scrollTo(0, 0)
}

// 搜索部分
const searchVal = ref<string>('')
const searchTimer = ref<Nullable<TimeoutHandle>>(null)
const searchAreaVisible = ref<boolean>(false)
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
  }, 100)
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

// 上拉加载的回调: 其中num:当前页 从1开始, size:每页数据条数,默认10
const upCallback = async (mescroll: any, offsetVal: any) => {
  await nextTick()
  const apiFunc = isMineTab.value
    ? bigVApi.getFollowedBigVList
    : bigVApi.getBigVList
  const params = {
    count: mescroll.size,
    offset: isEmpty(offsetVal) ? (mescroll.num - 1) * 10 : offsetVal
  } as any
  if (!isMineTab.value) {
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

// 去关注
const toFollow = () => {
  currentTab.value = 1
  changeTab()
}

const roundToNearestTen = (value: number) => {
  const base = 10
  return Math.floor(value / base) * base
}

/**
 * 牛人订阅or取消订阅
 * @param position 搜索search、列表list
 * @param type 关注发帖1、关注评论2
 * @param item 牛人信息
 */
const followAction = (position: string, type: number, item: any) => {
  const isFollow = type === 1 ? item.is_follow : item.is_follow_comment
  const hasNoComment = isEmpty(item.is_follow_comment)
  const apiFunc = isFollow ? bigVApi.bigvUnFollow : bigVApi.bigvFollow
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
      if (position === 'list') {
        const itemIndex = data.tableData.findIndex(
          (it: any) => it.bigv_id === item.bigv_id
        )
        // 如果是在我的订阅中取消关注，且当前大V取消关注后就在列表消失时。重置列表，并回到列表顶部
        if (isMineTab.value && hasNoComment) {
          changeTab()
        } else {
          const offsetVal = roundToNearestTen(itemIndex)
          upCallback(getMescroll(), offsetVal)
        }
      } else {
        bigVSearchHandler()
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

const followModalFlag = ref<boolean>(false)
const unFollowText = computed(() => userStore.unFollowText)
/**
 * 牛人订阅or取消订阅
 * @param position 搜索search、列表list
 * @param type 关注发帖1、关注评论2
 * @param item 牛人信息
 */
const followHandler = (position: string, type: number, item: any) => {
  if (!userStore.isFollowGZH) {
    bigVApi.isFollowGZH().then((res) => {
      if (res.status !== 1) return
      // status 0 未关注 status 1 已关注
      if (res.data === 1) {
        userStore.setFollowState(true)
        followAction(position, type, item)
      } else {
        followModalFlag.value = true
      }
    })
  } else {
    followAction(position, type, item)
  }
}
// 跳转我的-提醒设置
const toReminder = () => {
  uni.navigateTo({ url: '/pages/mine/detail/reminder' })
}

const canReset = ref(false)
onLoad(() => {
  // 跳转到指定tab
  const tabVal = uni.getStorageSync('bigVTabVal')
  if (tabVal) {
    currentTab.value = tabVal
    uni.removeStorage({
      key: 'bigVTabVal'
    })
  }
})

onShow(() => {
  // 跳转到指定tab
  const tabVal = uni.getStorageSync('bigVTabVal')
  if (canReset.value && tabVal) {
    currentTab.value = tabVal
    changeTab()
    uni.removeStorage({
      key: 'bigVTabVal'
    })
  }
  canReset.value = true
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

.sticky-tabs {
  z-index: 990;
  position: sticky;
  top: -1px;
  background-color: #fff;
  margin-bottom: 5px;
}
</style>
