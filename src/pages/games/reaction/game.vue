<script lang="ts" setup>
import type { PlayerResultEventData, ReactionResult } from '~/api'
import { EventType, GameType } from '~/api'

const delay = Math.random() * 6 + 2
let show_target = $ref(false)
let start_time: number
setTimeout(() => {
  show_target = true
  start_time = Date.now()
}, delay * 1000)

function clickHandler() {
  let data: ReactionResult
  if (show_target) {
    data = { failed: false, time: Date.now() - start_time }
  }
  else {
    data = { failed: true }
  }

  window.webxdc.sendUpdate({
    payload: {
      eventType: EventType.PlayerResult,
      data: {
        data,
        game: GameType.Reaction,
      } as PlayerResultEventData,
    },
  }, 'Reaction result')
}
</script>

<template lang="pug">
div.h-full.w-full.p-4
  .h-full.w-full.rounded(:class="show_target ? 'bg-pgeer' : 'bg-pred'" @click="clickHandler")
</template>
