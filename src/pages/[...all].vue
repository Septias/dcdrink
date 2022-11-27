<script lang="ts" setup>
import type { JoinEventData, StartGameEventData } from '~/api'
import { EventType, GameType, api, is_start_game_event } from '~/api'
import { useGameStore } from '~/stores/game'

const players = ref([] as string[])
const gameStore = useGameStore()

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
    api.sendUpdate(EventType.PlayerLeft, { name: window.webxdc.selfName }, '')
  }
}
document.addEventListener('visibilitychange', vis_change)

function startGame() {
  gameStore.king = window.webxdc.selfAddr
  api.sendUpdate(EventType.GameStarted, { game: GameType.Reaction, king: window.webxdc.selfAddr } as StartGameEventData, 'Game Startet')
}

onUnmounted(() => {
  document.removeEventListener('visibilitychange', vis_change)
  gameStore.players = players.value.length
})

const router = useRouter()
api.add_event_listener(data => players.value.push((data as JoinEventData).name), EventType.PlayerJoined)
api.add_event_listener(data => players.value.splice(players.value.indexOf((data as JoinEventData).name), 1), EventType.PlayerLeft)
api.add_event_listener((data) => {
  if (is_start_game_event(data)) {
    gameStore.king = data.king
    gameStore.currentGame = data.game
    router.push(`/games/${data.game}/introduction`)
  }
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
