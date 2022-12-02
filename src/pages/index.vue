<script lang="ts" setup>
import type { GameStartedEvent, JoinEvent } from '~/api'
import { EventType, GameType, api } from '~/api'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
const router = useRouter()

function startGame() {
  gameStore.king = window.webxdc.selfAddr
  api.sendUpdate({ type: EventType.GameStarted, game: GameType.Reaction, king: window.webxdc.selfAddr }, 'Game Started')
}

api.sendUpdate({ type: EventType.PlayerJoined, name: window.webxdc.selfName }, 'Player joined')

// temporary fix
await new Promise(resolve => setTimeout(() => resolve(true), 250))

const { players, playing } = await api.catchup()
console.log('catchup', players, playing)
gameStore.players = players
if (playing) {
  router.push('/join')
}

// listeners
api.add_event_listener(EventType.GameStarted, (data: GameStartedEvent) => {
  gameStore.king = data.king
  gameStore.currentGame = data.game
  router.push(`/games/${data.game}/introduction`)
})

api.add_event_listener(EventType.PlayerJoined, (data: JoinEvent) => {
  gameStore.players.add(data.name)
})

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
