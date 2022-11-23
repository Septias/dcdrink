import { acceptHMRUpdate, defineStore } from 'pinia'

export const useGameStore = defineStore('config', () => {
  const players = useStorage('player_coint', 0)
  return {
    players,
  }
})

export const last_serial = useStorage('last_serial', 0)

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
