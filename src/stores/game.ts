import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Ref } from 'vue'
import type { GameType } from '~/api'

export const useGameStore = defineStore('config', () => {
  const players = useStorage('player_coint', 0)
  const currentGame: Ref<GameType | undefined> = useStorage('current_game', undefined)
  return {
    players,
    currentGame,
  }
})

export const last_serial = useStorage('last_serial', 0)

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
