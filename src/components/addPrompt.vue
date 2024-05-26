<template>
  <view
    class="container"
    v-if="showTip"
    :style="{ top: position.top + 'px', right: position.right + 'px' }"
    @click="closeTip"
  >
    <view class="arrow"></view>
    <view class="body">
      <view class="bar">
        <text class="text">{{ text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { setStorage, getStorage } from '@/utils/storage'

const props = defineProps({
  text: {
    type: String,
    default: '1. 点击上方【···】\n 2.【添加到我的小程序】，访问更方便！'
  }
})

const showTip = ref<boolean>(false)
const position = ref<{ top: number; right: number }>({ top: 0, right: 0 })

const updatePosition = () => {
  const isSupport = !!wx.getMenuButtonBoundingClientRect
  const rect = isSupport ? wx.getMenuButtonBoundingClientRect() : {}
  wx.getSystemInfo({
    success: (res) => {
      position.value.top = -10
      position.value.right = res.screenWidth - rect.left - (rect.width * 3) / 4
    }
  })
}

const initTip = () => {
  const storedTip = getStorage('PROMPT_FLAG')
  showTip.value = typeof storedTip === 'boolean' ? storedTip : true
  updatePosition()
}

const closeTip = () => {
  showTip.value = false
  setStorage('PROMPT_FLAG', false)
}

onShow(() => {
  initTip()
})
</script>

<style lang="scss" scoped>
$background-color: rgba(0, 0, 0, 0.7);
$text-color: #fff;

.container {
  position: fixed;
  top: 0px;
  right: 0;
  z-index: 10001;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
}
.arrow {
  width: 0;
  height: 0;
  margin-right: 30px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent transparent #fff transparent;
  border-bottom-color: $background-color;
}

.body {
  min-height: 40px;
}
.bar {
  padding: 4px 8px;
  border-radius: 8px;
  background-color: $background-color;
  .text {
    font-size: 13px;
    font-weight: 400;
    color: $text-color;
  }
}
</style>
