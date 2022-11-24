<script lang="ts" setup>
import { EventType, api } from '~/api'
import { useGameStore } from '~/stores/game'

let ready = $ref(false)
let ready_players = $ref(0)

const gameStore = useGameStore()
const router = useRouter()

function readyUp() {
  ready = true
  window.webxdc.sendUpdate({
    payload: {
      eventType: EventType.PlayerReady,
    },
  }, 'Player Ready')
}

api.add_event_listener((_) => {
  ready_players += 1
  console.log(ready_players >= gameStore.players)
  if (ready_players >= gameStore.players) {
    api.stop_listening()
    router.push(`/games/${gameStore.currentGame}/game`)
  }
}, EventType.PlayerReady)
api.start_listening()

onUnmounted(() => {
  api.stop_listening()
})
</script>

<template lang="pug">
.h-full.flex.flex-col.p-15.text-center
  h1.text-5xl.font-bold.text-porange Reaction!
  .flex.gap-2.justify-center.text-white.grow.items-center.flex-col
    p.font-bold In diesem Spiel geht es um Schnelligkeit!
    p Sei der Erste, der auf den Bildschirm klickt, sobald die Farbe wechselt!

  .flex.justify-center.items-center.gap-2.flex-col
    p.font-bold.text-white.text-2xl.tracking-wider {{ready_players}}/{{gameStore.players}}
    button.rounded-xl.bg-porange.p-3.text-2xl.font-bold.text-background.grow(v-if="!ready" @click="readyUp") Got ya!
</template>
