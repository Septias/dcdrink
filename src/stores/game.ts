import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Ref } from 'vue'
import type { GameType } from '~/api'

export const useGameStore = defineStore('config', () => {
  const players = useStorage('player_count', 0)
  const currentGame: Ref<GameType | undefined> = useStorage('current_game', undefined)
  const king = ref('')
  const is_king = computed(() => king.value === window.webxdc.selfAddr)
  return {
    players,
    currentGame,
    king,
    is_king,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
