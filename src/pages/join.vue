<script lang="ts" setup>
import { EventType, api, is_next_game_event_data } from '~/api'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
const router = useRouter()

api.add_event_listener((data) => {
  if (is_next_game_event_data(data)) {
    gameStore.currentGame = data.game
    api.stop_listening()
    router.push(`/games/${data.game}/introduction`)
  }
}, EventType.NextGame)
api.start_listening()
</script>

<template lang="pug">
.h-screen.flex.flex-col.justify-center.items-center.p-2
  h1.text-2xl.font-bold.text-center.text-porange Waiting to join game...
</template>
