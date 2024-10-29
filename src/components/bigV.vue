<template>
  <view class="big-v-item">
    <template v-if="isNormalMode">
      <view class="user-info" @click="toBigVDetail">
        <image
          class="avatar"
          :src="props.item.avatar"
          mode="aspectFill"
        ></image>
        <view class="text-sm">
          <view class="nick-name">{{ props.item.nick }}</view>
          <view class="fans">
            <text class="mr-5" v-if="mode === 'bigV'">
              粉丝：{{ props.item.fans_num }}
            </text>
            <text>订阅：{{ props.item.wx_fans_num }}</text>
          </view>
          <view class="intro">{{ props.item.intro }}</view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="search-user-info" @click="toBigVDetail">
        <image
          class="avatar"
          :src="props.item.avatar"
          mode="aspectFill"
        ></image>
        <view class="font-bold text-sm">{{ props.item.nick }}</view>
      </view>
    </template>
    <div class="flex flex-col">
      <u-button
        class="follow-btn mb-3"
        shape="circle"
        :type="props.item.is_follow ? 'info' : 'success'"
        size="mini"
        @click="handleFollow(1)"
      >
        <view class="flex items-center">
          <template v-if="props.item.is_follow">
            <u-icon name="checkmark" size="24" class="mr-1"></u-icon>
            <text>已订阅发帖</text>
          </template>
          <template v-else>
            <u-icon name="plus" size="24" class="mr-1"></u-icon>
            <text>订阅发帖</text>
          </template>
        </view>
      </u-button>
      <template v-if="props.item.is_follow_comment !== null">
        <u-button
          class="follow-btn"
          shape="circle"
          :type="props.item.is_follow_comment ? 'info' : 'success'"
          size="mini"
          @click="handleFollow(2)"
        >
          <view class="flex items-center">
            <template v-if="props.item.is_follow_comment">
              <u-icon name="checkmark" size="24" class="mr-1"></u-icon>
              <text>已订阅评论</text>
            </template>
            <template v-else>
              <u-icon name="plus" size="24" class="mr-1"></u-icon>
              <text>订阅评论</text>
            </template>
          </view>
        </u-button>
      </template>
    </div>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'bigV',
    required: true,
    validator: (value: string) => ['bigV', 'search', 'pccz'].includes(value)
  },
  item: {
    type: Object,
    required: true
  }
})

const pageList = getCurrentPages()
const currentPage = pageList[pageList.length - 1]?.route
const bigVWhiteList = ['pages/bigV/index']

const emits = defineEmits(['follow'])

// 常规展示
const isNormalMode = computed(() => ['bigV', 'pccz'].includes(props.mode))

// type 关注发帖1、关注评论2
const handleFollow = (type: number) => {
  emits('follow', type, props.item)
}

// 跳转消息详情
const toBigVDetail = () => {
  // 牛人列表可以跳转消息详情
  if (!bigVWhiteList.includes(currentPage)) return
  uni.navigateTo({
    url: `/pages/bigV/detail?id=${props.item.bigv_id}`
  })
}
</script>

<style lang="scss" scoped>
.big-v-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px 10px;
  padding-right: 20px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .nick-name {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    margin-bottom: 5px;
  }
  .fans {
    font-size: 13px;
    color: #888;
    margin-bottom: 6px;
  }
  .intro {
    font-size: 13px;
    color: #666;
    margin-bottom: 5px;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.search-user-info {
  display: flex;
  align-items: center;
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.follow-btn {
  ::v-deep button {
    width: 90px;
  }
}
</style>
