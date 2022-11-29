import type { Router } from 'vue-router'
import { EventType, api, cards, is_next_game_event_data } from './api'
import { useGameStore } from './stores/game'

const gameStore = useGameStore()

export function register_next_game_handler(router: Router, cb = () => {}) {
  api.add_event_listener((data) => {
    if (is_next_game_event_data(data)) {
      gameStore.currentGame = data.game
      cb()
      console.log(data.game, cards, cards.findIndex(gameType => data.game === gameType))
      if (cards.findIndex(gameType => data.game === gameType) !== -1) {
        console.log('next game is a card game')

        router.push(`/cards/${data.game}`)
      }
      else {
        router.push(`/games/${data.game}/introduction`)
      }
    }
  }, EventType.NextGame)
}
