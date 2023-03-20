<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import pako from 'pako'
const { theme, themeOverrides } = useTheme()
const test = { my: 'super', puper: [456, 567], awesome: 'pako' };

let str = JSON.stringify(test)
const compressed = pako.deflate(str);
const gzip = pako.gzip(str)
console.log(str, 'str length', str.length)
console.log(compressed, gzip)
// 1 个英文字符是1个字节 8位 49*8=392
//  Uint8Array 数组类型表示一个 8 位无符号整型数组  52*4=208 208/392=53%
const socket = new WebSocket("ws://test.go.163.com/websocket/?room_id="+1);
setTimeout(() => {
  socket.send(str)
}, 500)
setTimeout(() => {
  socket.send(compressed)
}, 1000)
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>
