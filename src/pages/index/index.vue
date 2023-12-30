<template>
  <view>
    <u-tabs
      :list="tabList"
      :is-scroll="false"
      active-color="#59c272"
      v-model="currentTab"
      @change="changeTab"
    ></u-tabs>
    <view class="message-list">
      <message-item
        v-for="item in data.tableData"
        :key="item.mes_id"
        :item="item"
      ></message-item>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// import { homeApi } from '@/api'
import { messageList } from './mock'
import MessageItem from '@/components/MessageItem'

const currentTab = ref(0)

const tabList = reactive([
  {
    name: '未读'
  },
  {
    name: '已读'
  },
  {
    name: '全部'
  }
])

const data = reactive({ tableData: [] })

const queryMessageList = () => {
  data.tableData = messageList.map((it) => {
    return { ...it, needExpand: it.message.length > 300 }
  })
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
  // this.queryMessageList()
}

onMounted(() => {
  queryMessageList()
})
</script>

<style scoped lang="scss">
.message-list {
  background-color: #f0f0f0;
  padding: 10px 0;
}
</style>
