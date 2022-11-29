<script lang="ts" setup>
import type { GameStartedEventData, JoinEventData } from '~/api'
import { EventType, GameType, api, is_start_game_event } from '~/api'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
const router = useRouter()

function startGame() {
  gameStore.king = window.webxdc.selfAddr
  api.sendUpdate(EventType.GameStarted, { game: GameType.Reaction, king: window.webxdc.selfAddr } as GameStartedEventData, 'Game Startet')
}

api.sendUpdate(EventType.PlayerJoined, { name: window.webxdc.selfName }, 'Player joined')

// temporary fix
await new Promise(resolve => setTimeout(() => resolve(true), 250))

const { players, playing } = await api.catchup()
console.log('catchup', players, playing)
gameStore.players = players
if (playing) {
  router.push('/join')
}

// listeners
api.add_event_listener((data) => {
  if (is_start_game_event(data)) {
    gameStore.king = data.king
    gameStore.currentGame = data.game
    router.push(`/games/${data.game}/introduction`)
  }
}, EventType.GameStarted)
api.add_event_listener((data) => {
  gameStore.players.add((data as JoinEventData).name)
}, EventType.PlayerJoined)

api.start_listening()
</script>

<template lang="pug">
.h-screen.flex.flex-col.justify-between.p-15
  h1.text-5xl.font-bold.text-center.text-porange Trinkspiele
  .flex.gap-2.justify-center.flex-wrap
    .my-1.bg-red.rounded.text-background.font-bold.p-1.leading-none.text-3xl.text-center(v-for="player in gameStore.players")
        | {{player}}

  button.rounded-xl.bg-orange.p-4.text-5xl.font-bold.text-background(@click="startGame") Start
</template>
