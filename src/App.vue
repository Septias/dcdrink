<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,

import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'
import type { JoinEventData } from './api'
import { EventType, api } from './api'
import { useGameStore } from './stores/game'

// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'DcDrink',
  meta: [
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})

document.addEventListener('keydown', (key) => {
  if (key.key === 's') {
    console.log('reset serial')
    api.last_serial = 0
  }
})
const { players } = storeToRefs(useGameStore())

api.add_event_listener(data => players.value.push((data as JoinEventData).name), EventType.PlayerJoined)
api.add_event_listener(data => players.value.splice(players.value.indexOf((data as JoinEventData).name), 1), EventType.PlayerLeft)

const gameStore = useGameStore()
onUnmounted(() => {
  api.save()
  api.sendUpdate(EventType.PlayerLeft, { name: window.webxdc.selfName }, '')
  if (gameStore.is_king) {
    api.sendUpdate(EventType.GameEnded, undefined, 'Game Ended')
  }
})
</script>

<template>
  <RouterView />
</template>
