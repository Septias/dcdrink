import type { Router } from 'vue-router'
import type { NextGameEvent } from './api'
import { EventType, api, cards } from './api'
import { useGameStore } from './stores/game'

const gameStore = useGameStore()

export function register_next_game_handler(router: Router, cb = () => {}) {
  api.add_event_listener(EventType.NextGame, (data: NextGameEvent) => {
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
  })
}
