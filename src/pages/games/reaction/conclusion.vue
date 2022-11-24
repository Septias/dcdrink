<script lang="ts" setup>
import type { PlayerResultEventData, ReactionResult } from '~/api'
import { EventType, api } from '~/api'

const results: ReactionResult[] = $ref([])

const ordered_results = computed(() =>
  results.map((elem) => { return { ...elem, time: (elem.time || 100000000) / 1000 } })
    .sort((a, b) => a.time - b.time),
)

api.add_event_listener((res) => {
  const { data } = res as PlayerResultEventData
  console.log(data)
  results.push(data)
}, EventType.PlayerResult)
api.start_listening()
</script>

<template lang="pug">
.h-full.flex.flex-col.p-15.text-center
  h1.text-5xl.font-bold.text-porange Conclusion!
  .flex.flex-col.justify-center.items-center.grow
    .flex.font-bold.text-2xl.justify-between.w-full
      div
        p.text-porange(v-for="result in ordered_results") {{result.name}}
      div.flex.items-center.flex-col
        template(v-for="result in ordered_results")
          p.text-white.ml-2(v-if="!result.failed") {{result.time}}s
          p.text-pred.ml-2.i-carbon-x(v-if="result.failed")
</template>
