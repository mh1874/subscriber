<template>
  <view>
    <u-tabs
      :list="tabList"
      :is-scroll="false"
      active-color="#59c272"
      v-model="currentTab"
      @change="changeTab"
    ></u-tabs>
    <view class="big-v-list">
      <big-v
        v-for="item in data.tableData"
        :key="item.bigv_id"
        :item="item"
      ></big-v>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// import { homeApi } from '@/api'
import { bigvs } from '../index/mock'
import BigV from '@/components/bigV.vue'

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

const data = reactive({ tableData: [] })

const queryBigVList = () => {
  data.tableData = bigvs
  // 请求backend获取数据
  // homeApi
  //   .getSubscribedList(0)
  //   .then((v) => {
  //     // 处理返回数据
  //     data.tableData = v.data
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
}

const changeTab = (index: number) => {
  const statusVal = index
  console.log(statusVal)
  // 切换tab时 根据状态请求backend
  // this.queryBigVList()
}

onMounted(() => {
  queryBigVList()
})
</script>

<style scoped lang="scss">
.big-v-list {
  background-color: #f0f0f0;
  padding: 10px 0;
}
</style>
