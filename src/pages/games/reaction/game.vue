<script lang="ts" setup>
import type { PlayerResultEventData, ReactionResult } from '~/api'
import { EventType, GameType, api } from '~/api'
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
  let data: ReactionResult
  if (show_target) {
    data = { failed: false, time: Date.now() - start_time, name: window.webxdc.selfName }
  }
  else {
    data = { failed: true, name: window.webxdc.selfName }
  }

  api.sendUpdate(EventType.PlayerResult, {
    data,
    game: GameType.Reaction,
  } as PlayerResultEventData, 'Reaction result')
  router.push(`/games/${gameStore.currentGame}/conclusion`)
}
</script>

<template lang="pug">
div.h-full.w-full.p-4
  .h-full.w-full.rounded(:class="show_target ? 'bg-pgreen' : 'bg-pred'" @click="clickHandler")
</template>
