<template>
  <view class="home-page">
    <Hello />
    <!-- <navigator v-for="(v, idx) in pages" :key="idx" :url="v.url">{{
        v.title
      }}</navigator> -->
  </view>
</template>

<script setup lang="ts">
// import { reactive } from 'vue'
import Hello from '@/components/hello/index.vue'
// import UnoCss from '@/components/unocss/index.vue'

// const pages = reactive([
//   {
//     title: 'Pinia Demo',
//     url: '/pages/pinia/index'
//   },
//   {
//     title: 'Axios Demo',
//     url: '/pages/axios/index'
//   },
//   {
//     title: 'uView Demo',
//     url: '/pages/uview/index'
//   },
//   {
//     title: 'UnoCSS Demo',
//     url: '/pages/unocss/index'
//   }
// ])
</script>

<style scoped></style>
