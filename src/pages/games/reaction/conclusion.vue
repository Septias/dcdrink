<script lang="ts" setup>
import type { PlayerResultEventData, ReactionResult } from '~/api'
import { EventType, api } from '~/api'
import { draw_random_game } from '~/random_game'
import { useGameStore } from '~/stores/game'
import { register_next_game_handler } from '~/utility'

const results: ReactionResult[] = $ref([])

const ordered_results = computed(() =>
  results.map((elem) => { return { ...elem, time: (elem.time || 100000000) / 1000 } })
    .sort((a, b) => a.time - b.time),
)

api.add_event_listener((res) => {
  const { data } = res as PlayerResultEventData
  results.push(data)
}, EventType.PlayerResult)

const gameStore = useGameStore()

function nextGame() {
  if (gameStore.is_king) {
    const game = draw_random_game()
    api.sendUpdate(EventType.NextGame, game)
  }
}

const router = useRouter()
register_next_game_handler(router, () => { api.stop_listening() })
api.start_listening()
</script>

<template lang="pug">
Border(heading="Results!" @all-ready="nextGame")
  .flex.font-bold.text-2xl.justify-between.w-full.flex-col
    .flex.justify-between.gap-2(v-for="result in ordered_results")
      span.text-porange.overflow-hidden {{result.name}}
      span.text-white.ml-2(v-if="!result.failed") {{result.time}}s
      span.text-pred.ml-2.i-carbon-x(v-if="result.failed")
</template>
