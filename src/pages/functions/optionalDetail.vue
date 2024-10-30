<template>
  <view class="detail-page">
    <view class="user-info">
      <image class="avatar" :src="detail.bigv.avatar" mode="aspectFill"></image>
      <view class="nick-name">{{ detail.bigv.nick }}</view>
    </view>
    <view class="card">
      <view class="optional-count">
        <text>TA的自选</text>
        <view class="flex items-center">
          <text class="count">{{ detail.count }}</text>
          <text>个</text>
        </view>
      </view>
      <view class="stock-list">
        <view
          v-for="(it, index) in detail.message"
          :key="index"
          class="stock-item"
        >
          <view>
            <text class="font-medium mr-2">{{ it.name }}</text>
            <u-tag :show="it.isNew" text="new" type="error" size="mini" light />
          </view>
          <text>{{ it.created }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { functionsApi } from '@/api'

const { proxy } = getCurrentInstance()
const bigVId = ref<number>(0)
const detail = reactive<any>({ bigv: {}, message: [], count: 0 })

const getOptionalStocks = async () => {
  try {
    const { status, data } = await functionsApi.getOptionalDetail(bigVId.value)
    if (status !== 1) return
    detail.bigv = data.bigv
    const handledMsgStr = data.message.replace(/'/g, '"')
    const parseMsg = JSON.parse(handledMsgStr)
    detail.message = parseMsg.map((it: any) => {
      return {
        ...it,
        created: proxy.$dayjs(it.created).format('YYYY-MM-DD'),
        isNew: proxy.$dayjs(it.created).isToday()
      }
    })
    detail.count = detail.message?.length
  } catch (error) {
    console.error(error)
  }
}

onLoad((option: any) => {
  bigVId.value = option.id && Number(option.id)
  getOptionalStocks()
})

onShow(() => {
  uni.$u.mpShare.path = ''
  uni.$u.mpShare.imageUrl = ''
})
</script>

<style lang="scss" scoped>
.detail-page {
  padding: 15px;
  background-color: #f0fdfa;
  .card {
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  .user-info {
    @extend .card;
    margin-bottom: 20px;
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-bottom: 10px;
    }
    .nick-name {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 5px;
    }
  }
  .optional-count {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 15px;
    .count {
      color: #f97316;
      font-weight: 500;
      font-size: 16px;
      margin-right: 3px;
    }
  }
  .stock-list {
    line-height: 36px;
    .stock-item {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
    }
  }
}
</style>
