<script lang="ts" setup>
import { EventType, api } from '~/api'
import { useGameStore } from '~/stores/game'

defineProps({
  heading: {
    type: String,
    required: true,
  },

})
const emit = defineEmits(['allReady'])
let ready = $ref(false)
let ready_players = $ref(0)

const gameStore = useGameStore()

function readyUp() {
  ready = true
  api.sendUpdate(EventType.PlayerReady)
}

api.add_event_listener((_) => {
  ready_players += 1
  if (ready_players >= gameStore.players) {
    emit('allReady')
  }
}, EventType.PlayerReady)

onMounted(() => api.start_listening())
onUnmounted(() => api.stop_listening())
</script>

<template lang="pug">
.h-full.flex.flex-col.p-15.text-center
  h1.text-5xl.font-bold.text-porange {{ heading }}
  .flex.gap-2.justify-center.text-white.grow.items-center.flex-col
    slot

  .flex.justify-center.items-center.gap-2.flex-col
    p.font-bold.text-white.text-2xl.tracking-wider {{ready_players}}/{{gameStore.players}}
    button.rounded-xl.bg-porange.p-3.text-2xl.font-bold.text-background.grow(v-if="!ready" @click="readyUp") Got ya!
</template>
