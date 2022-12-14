import type { ReceivedStatusUpdate } from './webxdc'

export enum EventType {
  PlayerJoined,
  PlayerLeft,
  GameStarted,
  GameEnded,
  PlayerReady,
  PlayerResult,
  NextGame,
}

export enum GameType {
  Reaction = 'reaction',
  Category = 'category',
}

export const cards = [GameType.Category]

export interface ReactionResult {
  failed: boolean
  time?: number
  name: string
}

type PlayerResult = ReactionResult

export interface JoinEventData {
  name: string
}

export interface LeaveEventData {
  name: string
}

export interface GameStartedEventData {
  game: GameType
  king: string
}

export function is_start_game_event(data: any): data is GameStartedEventData {
  return data.game && data.king
}

export interface PlayerResultEventData {
  game: GameType
  data: PlayerResult
}

export interface NextGameEventData {
  game: GameType
  data?: any
}

export function is_next_game_event_data(data: any): data is GameStartedEventData | NextGameEventData {
  return data.game
}

type PayloadData = JoinEventData | LeaveEventData | GameStartedEventData | PlayerResultEventData | NextGameEventData | undefined

interface Payload {
  eventType: EventType
  data: PayloadData
}

interface DatedPayload {
  eventType: EventType
  data: PayloadData
  ts: number
}

function empty_listeners() {
  return {
    [EventType.PlayerJoined]: [],
    [EventType.PlayerLeft]: [],
    [EventType.GameStarted]: [],
    [EventType.PlayerReady]: [],
    [EventType.PlayerResult]: [],
    [EventType.NextGame]: [],
    [EventType.GameEnded]: [],
  }
}

export class API {
  event_listeners: Record<EventType, ((data: PayloadData) => void)[]> = empty_listeners()
  last_serial = 0

  constructor() {
    this.last_serial = parseInt(localStorage.getItem('last_serial') || '0')
  }

  save() {
    localStorage.setItem('last_serial', this.last_serial.toString())
  }

  add_event_listener(cb: (payload: PayloadData) => void, event_type: EventType) {
    this.event_listeners[event_type].push(cb)
  }

  start_listening() {
    console.log('start listening from', this.last_serial)
    window.webxdc.setUpdateListener(this.handler.bind(this), this.last_serial)
  }

  handler(update: ReceivedStatusUpdate<Payload>) {
    const { payload, serial } = update
    console.log(serial)
    this.last_serial = serial
    for (const listener of this.event_listeners[payload.eventType]) {
      listener(payload.data)
    }
  }

  catchup(): Promise<{ players: Set<string>; playing: boolean }> {
    return new Promise((resolve) => {
      const players = new Set() as Set<string>
      let playing = false
      window.webxdc.setUpdateListener((e) => {
        console.log(e.serial, e.payload.eventType)

        if (e.payload.eventType === EventType.PlayerJoined) {
          console.log('player joined', e.payload.data.name)
          players.add(e.payload.data.name)
        }
        else if (e.payload.eventType === EventType.PlayerLeft) {
          players.delete(e.payload.data.name)
        }
        else if (e.payload.eventType === EventType.GameStarted) {
          playing = true
        }
        else if (e.payload.eventType === EventType.GameEnded) {
          playing = false
        }
        if (e.max_serial === e.serial) {
          console.log('done: ', players, e.max_serial)
          this.last_serial = e.max_serial
          resolve({ players, playing })
        }
      })
    })
  }

  stop_listening() {
    console.log('stop listening')
    this.event_listeners = empty_listeners()
    window.webxdc.setUpdateListener(e => console.log('missed event: ', e), this.last_serial)
  }

  sendUpdate(eventType: EventType, data?: PayloadData, msg = '') {
    window.webxdc.sendUpdate({
      payload: {
        eventType,
        data,
        ts: Date.now(),
      } as DatedPayload,
    }, msg)
  }
}

export const api = new API()
