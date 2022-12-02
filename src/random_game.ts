import type { NextGameEvent } from './api'
import { EventType, GameType } from './api'
import { useGameStore } from './stores/game'

const gameStore = useGameStore()

function createForGameType(game: GameType): () => NextGameEvent {
  return () => { return { game, type: EventType.NextGame } }
}

function cardGenerator(): NextGameEvent {
  return { type: EventType.NextGame, game: GameType.Category, data: { player: gameStore.random_player() } }
}

const gameConstructors: (() => NextGameEvent)[] = [createForGameType(GameType.Reaction), cardGenerator]

export function draw_random_game() {
  return gameConstructors[Math.floor(Math.random() * (gameConstructors.length - 0.01))]()
}
