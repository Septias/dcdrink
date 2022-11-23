import { last_serial } from './stores/game'
import type { ReceivedStatusUpdate } from './webxdc'

export enum EventType {
  PlayerJoined,
  PlayerLeft,
  GameStarted,
  PlayerReady,
  PlayerResult,
}

export enum GameType {
  Reaction = 'reaction',
}

export interface ReactionResult {
  failed: boolean
  time?: number
}

type PlayerResult = ReactionResult

export interface JoinEventData {
  name: string
}

export interface LeaveEventData {
  name: string
}

export interface StartGameEventData {
  game: GameType
}

export interface PlayerResultEventData {
  game: GameType
  data: PlayerResult
}

type PayloadData = JoinEventData | LeaveEventData | StartGameEventData | PlayerResultEventData

interface Payload {
  eventType: EventType
  data: PayloadData
}

export class API {
  event_listeners: Record<EventType, ((data: PayloadData) => void)[]> = {
    [EventType.PlayerJoined]: [],
    [EventType.PlayerLeft]: [],
    [EventType.GameStarted]: [],
    [EventType.PlayerReady]: [],
    [EventType.PlayerResult]: [],
  }

  add_event_listener(cb: (payload: PayloadData) => void, event_type: EventType) {
    this.event_listeners[event_type].push(cb)
  }

  handler(update: ReceivedStatusUpdate<Payload>) {
    const { payload, serial } = update
    last_serial.value = serial
    for (const listener of this.event_listeners[payload.eventType]) {
      listener(payload.data)
    }
  }

  start_listening() {
    window.webxdc.setUpdateListener(this.handler.bind(this), last_serial.value)
  }
}

export const api = new API()
