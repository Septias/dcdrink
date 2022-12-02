<script lang="ts" setup>
import type { ReactionResultEvent } from '~/api'
import { EventType, api } from '~/api'
import { useGameStore } from '~/stores/game'

const delay = Math.random() * 6 + 2
let show_target = $ref(false)
let start_time: number

setTimeout(() => {
  show_target = true
  start_time = Date.now()
}, delay * 1000)

const router = useRouter()
const gameStore = useGameStore()

function clickHandler() {
  let event: ReactionResultEvent
  if (show_target) {
    event = { type: EventType.ReactionResult, failed: false, time: Date.now() - start_time, name: window.webxdc.selfName }
  }
  else {
    event = { type: EventType.ReactionResult, failed: true, name: window.webxdc.selfName }
  }

  api.sendUpdate(event, 'Reaction result')
  router.push(`/games/${gameStore.currentGame}/conclusion`)
}
</script>

<template lang="pug">
div.h-full.w-full.p-4
  .h-full.w-full.rounded(:class="show_target ? 'bg-pgreen' : 'bg-pred'" @click="clickHandler")
</template>
