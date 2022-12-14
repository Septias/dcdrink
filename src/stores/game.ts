import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Ref } from 'vue'
import type { GameType } from '~/api'

export const useGameStore = defineStore('config', () => {
  const players = useStorage('players', new Set() as Set<string>)
  const player_count = computed(() => players.value.size)
  const currentGame: Ref<GameType | undefined> = useStorage('current_game', undefined)
  const king = ref('')
  const is_king = computed(() => king.value === window.webxdc.selfAddr)
  const random_player = () => {
    return Array.from(players.value)[Math.floor(Math.random() * (players.value.size - 0.01))]
  }

  return {
    players,
    player_count,
    currentGame,
    king,
    is_king,
    random_player,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
