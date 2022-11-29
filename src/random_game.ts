import type { NextGameEventData } from './api'
import { GameType } from './api'
import { useGameStore } from './stores/game'

const gameStore = useGameStore()

function createForGameType(game: GameType) {
  return () => { return { game } }
}

function cardGenerator() {
  return { game: GameType.Category, data: { player: gameStore.random_player() } }
}

const gameConstructors: (() => NextGameEventData)[] = [createForGameType(GameType.Reaction), cardGenerator]

export function draw_random_game() {
  return gameConstructors[Math.floor(Math.random() * (gameConstructors.length - 0.01))]()
}
