<script lang="ts" setup>
import { api } from '~/api'
import { useGameStore } from '~/stores/game'

const router = useRouter()
const gameStore = useGameStore()

function allReadyHandler() {
  router.push(`/games/${gameStore.currentGame}/game`)
}

onMounted(() => api.start_listening())
onUnmounted(() => api.stop_listening())
</script>

<template lang="pug">
Border(heading="Reaction!" @allReady="allReadyHandler")
  div
    p.font-bold In diesem Spiel geht es um Schnelligkeit!
    p Sei der Erste, der auf den Bildschirm klickt, sobald die Farbe wechselt!
</template>
