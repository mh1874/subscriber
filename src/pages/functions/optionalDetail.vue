<template>
  <view class="detail-page">
    <view class="header-bg"></view>
    <view class="user-info">
      <view class="user-name">
        <image
          class="avatar"
          :src="detail.bigv.avatar"
          mode="aspectFill"
        ></image>
        <text class="name">{{ detail.bigv.nick }}</text>
      </view>
      <view class="change">
        <text class="change-label">最新变动：</text>
        <view v-if="hasLastChange">
          <view>{{ detail.bigv.lastChange }}</view>
          <view>{{ detail.bigv.changeTime }}</view>
        </view>
        <text v-else>无</text>
      </view>
    </view>
    <view class="content">
      <view class="optional-count">
        <view>
          <text text-black mr-3>TA的自选</text>
          <text class="count">{{ detail.count }} 个</text>
        </view>
        <view>
          <text text-black>添加时间</text>
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
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { functionsApi } from '@/api'

const { proxy } = getCurrentInstance()
const bigVId = ref<number>(0)
const detail = reactive<any>({ bigv: {}, message: [], count: 0 })

// 是否有最新变动
const hasLastChange = computed(
  () => detail.bigv.lastChange && detail.bigv.changeTime
)

const getOptionalStocks = async () => {
  try {
    const { status, data } = await functionsApi.getOptionalDetail(bigVId.value)
    if (status !== 1) return
    detail.bigv = {
      ...data.bigv,
      lastChange: data.last_change,
      changeTime: proxy
        .$dayjs(data.last_change_time)
        .format('YYYY-MM-DD HH:mm:ss')
    }
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
  height: 812px;
  background: linear-gradient(180deg, #f0fdf4 0%, #fff 100%),
    radial-gradient(
      118% 54% at 91% 14%,
      #f0fdf4 0%,
      rgba(223, 238, 254, 0) 100%
    ),
    radial-gradient(137% 63% at 0% 0%, #f0fdf4 0%, #fff 100%), #ffffff;
  .header-bg {
    width: 100%;
    height: 120px;
    background: linear-gradient(180deg, #59bb73 0%, #4ade80 100%);
    border-radius: 0 0 12px 12px;
  }
  .user-info {
    padding: 15px;
    border-radius: 6px 24px 6px 24px;
    background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
    box-sizing: border-box;
    box-shadow: 0px 8px 16px 0px rgba(53, 103, 238, 0.14);
    margin: -90px 15px 30px;
    .user-name {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .name {
        font-size: 20px;
        font-weight: 500;
      }
    }
    .change {
      display: flex;
      .change-label {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
  .content {
    margin: 0 15px;
    color: #4a617e;
    .optional-count {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: 500;
      .count {
        color: #f97316;
        font-weight: 500;
        margin-right: 5px;
      }
    }
    .stock-list {
      line-height: 40px;
      font-size: 16px;
      .stock-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f1f5f9;
      }
    }
  }
}
</style>
