<template>
  <view>
    <scroll-view class="search-content" scroll-y="true">
      <big-v
        mode="search"
        v-for="item in optionalData.list"
        :key="item.bigv_id"
        :item="item"
        @follow="followHandler"
      ></big-v>
    </scroll-view>
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
import { ref, reactive, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { functionsApi, bigVApi } from '@/api'
import { useUserStore } from '@/store'
import BigV from '@/components/bigV.vue'

const userStore = useUserStore()
const optionalData = reactive<{ list: any }>({
  list: []
})

// 获取可订阅自选的牛人列表
const queryOptionalData = () => {
  functionsApi
    .getOptionalBigVList()
    .then((res) => {
      if (res.status !== 1) return
      optionalData.list = res.data.map((it: any) => {
        return { ...it, open: false }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * 牛人订阅or取消订阅
 * @param type 关注发帖1
 * @param item 牛人信息
 */
/**
 * 牛人订阅or取消订阅
 * @param position 搜索search、列表list
 * @param type 关注发帖1、关注评论2
 * @param item 牛人信息
 */
const followAction = (type: number, item: any) => {
  const apiFunc = item.is_follow ? bigVApi.bigvUnFollow : bigVApi.bigvFollow
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
      // todo 更新列表
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

onLoad(() => {
  queryOptionalData()
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
</style>
