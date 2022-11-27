<script lang="ts" setup>
import type { PlayerResultEventData, ReactionResult } from '~/api'
import { EventType, api, is_next_game_event_data } from '~/api'
import { draw_random_game } from '~/random_game'
import { useGameStore } from '~/stores/game'

const results: ReactionResult[] = $ref([])

const ordered_results = computed(() =>
  results.map((elem) => { return { ...elem, time: (elem.time || 100000000) / 1000 } })
    .sort((a, b) => a.time - b.time),
)

api.add_event_listener((res) => {
  const { data } = res as PlayerResultEventData
  results.push(data)
}, EventType.PlayerResult)

function nextGame() {
  const game = draw_random_game()
  api.sendUpdate(EventType.NextGame, { game })
}

const gameStore = useGameStore()
const router = useRouter()
api.add_event_listener((data) => {
  if (is_next_game_event_data(data)) {
    gameStore.currentGame = data.game
    api.stop_listening()
    router.push(`/games/${data.game}/introduction`)
  }
}, EventType.NextGame)

onMounted(() => api.start_listening())
</script>

<template lang="pug">
Border(heading="Results!" @all-ready="nextGame")
  .flex.font-bold.text-2xl.justify-between.w-full
    div
      p.text-porange(v-for="result in ordered_results") {{result.name}}
    div.flex.items-center.flex-col
      template(v-for="result in ordered_results")
        p.text-white.ml-2(v-if="!result.failed") {{result.time}}s
        p.text-pred.ml-2.i-carbon-x(v-if="result.failed")
</template>
