<script lang="ts" setup>
import type { JoinEventData, StartGameEventData } from '~/api'
import { EventType, GameType, api } from '~/api'
import { useGameStore } from '~/stores/game'

const players = ref([] as string[])

// Player join/leave event handling
onMounted(() => {
  window.webxdc.sendUpdate({
    payload: {
      eventType: EventType.PlayerJoined,
      data: { name: window.webxdc.selfName },
    },
  }, 'Player joined')
})

const vis_change = () => {
  if (document.visibilityState === 'hidden') {
    window.webxdc.sendUpdate({
      payload: {
        eventType: EventType.PlayerLeft,
        data: { name: window.webxdc.selfName },
      },
    }, 'Player left')
  }
}
document.addEventListener('visibilitychange', vis_change)

function startGame() {
  window.webxdc.sendUpdate({
    payload: {
      eventType: EventType.GameStarted,
      data: { game: GameType.Reaction } as StartGameEventData,
    },
  }, 'Start game')
}

const gameStore = useGameStore()
onUnmounted(() => {
  document.removeEventListener('visibilitychange', vis_change)
  gameStore.players = players.value.length
})

const router = useRouter()
api.add_event_listener(data => players.value.push((data as JoinEventData).name), EventType.PlayerJoined)
api.add_event_listener(data => players.value.splice(players.value.indexOf((data as JoinEventData).name), 1), EventType.PlayerLeft)
api.add_event_listener((data) => {
  gameStore.currentGame = (data as StartGameEventData).game
  router.push(`/games/${(data as StartGameEventData).game}/introduction`)
}, EventType.GameStarted)

api.start_listening()
</script>

<template lang="pug">
.h-screen.flex.flex-col.justify-between.p-15
  h1.text-5xl.font-bold.text-center.text-porange Trinkspiele
  .flex.gap-2.justify-center.flex-wrap
    .my-1.bg-red.rounded.text-background.font-bold.p-1.leading-none.text-3xl.text-center(v-for="player in players")
        | {{player}}

  button.rounded-xl.bg-orange.p-4.text-5xl.font-bold.text-background(@click="startGame") Start
</template>
