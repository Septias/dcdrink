<script lang="ts" setup>
import { EventType, api } from '~/api'
import { draw_random_game } from '~/random_game'
import { useGameStore } from '~/stores/game'
import { register_next_game_handler } from '~/utility'

const gameStore = useGameStore()
const router = useRouter()

function handle_ready() {
  if (gameStore.is_king) {
    api.sendUpdate(EventType.NextGame, draw_random_game(), 'starting next game')
  }
}
register_next_game_handler(router, () => { api.stop_listening() })
api.start_listening()
</script>

<template lang="pug">
Border(heading="Category" @all-ready="handle_ready")
  p Ein Spieler wählt eine Kategorie aus
  p Im Uhrzeigersinn sagt jeder ein Wort zu dieser Kategorie
  p Weiß ein Spieler nicht weiter oder wiederholt ein bereits gesagtes Wort muss er trinken
</template>
