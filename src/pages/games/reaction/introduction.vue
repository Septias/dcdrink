<script lang="ts" setup>
import { useGameStore } from '~/stores/game'

const router = useRouter()
const gameStore = useGameStore()

function allReadyHandler() {
  router.push(`/games/${gameStore.currentGame}/game`)
}
</script>

<template lang="pug">
Border(heading="Introduction" @allReady="allReadyHandler")
  div
    p.font-bold In diesem Spiel geht es um Schnelligkeit!
    p Sei der Erste, der auf den Bildschirm klickt, sobald die Farbe wechselt!
</template>
