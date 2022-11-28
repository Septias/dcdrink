<script setup lang="ts">
import { RouterView } from 'vue-router'
import { EventType, api } from './api'
import { useGameStore } from './stores/game'

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
  if (key.key === 'l') {
    console.log('listeners: ', api.event_listeners)
  }
})

// TODO: fix late joining
// const { players } = storeToRefs(useGameStore())
// api.add_event_listener(data => players.value.push((data as JoinEventData).name), EventType.PlayerJoined)
// api.add_event_listener(data => players.value.splice(players.value.indexOf((data as JoinEventData).name), 1), EventType.PlayerLeft)

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
