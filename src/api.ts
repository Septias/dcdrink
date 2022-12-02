import type { ReceivedStatusUpdate } from './webxdc'

export enum EventType {
  PlayerJoined,
  PlayerLeft,
  GameStarted,
  GameEnded,
  PlayerReady,
  ReactionResult,
  NextGame,
}

export enum GameType {
  Reaction = 'reaction',
  Category = 'category',
}

export const cards = [GameType.Category]

export interface JoinEvent {
  type: EventType.PlayerJoined
  name: string
}

export interface LeaveEvent {
  type: EventType.PlayerLeft
  name: string
}

export interface GameStartedEvent {
  type: EventType.GameStarted
  game: GameType
  king: string
}

export interface NextGameEvent {
  type: EventType.NextGame
  game: GameType
  data?: any
}
export interface ReactionResultEvent {
  type: EventType.ReactionResult
  failed: boolean
  time?: number
  name: string
}

export interface PlayerReadyEvent {
  type: EventType.PlayerReady
}

export interface GameEndedEvent {
  type: EventType.GameEnded
}

type Payload = JoinEvent | LeaveEvent | GameStartedEvent | NextGameEvent | ReactionResultEvent | PlayerReadyEvent | GameEndedEvent

function empty_listeners() {
  return {
    [EventType.PlayerJoined]: [] as ((data: JoinEvent) => void)[],
    [EventType.PlayerLeft]: [] as ((data: LeaveEvent) => void)[],
    [EventType.GameStarted]: [] as ((data: GameStartedEvent) => void)[],
    [EventType.PlayerReady]: [] as ((data: PlayerReadyEvent) => void)[],
    [EventType.NextGame]: [] as ((data: NextGameEvent) => void)[],
    [EventType.GameEnded]: [] as ((data: GameEndedEvent) => void)[],
    [EventType.ReactionResult]: [] as ((data: ReactionResultEvent) => void)[],
  }
}

class Client {
  public event_listeners = empty_listeners()

  add_event_listener(event_type: EventType, cb: (event: JoinEvent) => void): void
  add_event_listener(event_type: EventType, cb: (event: LeaveEvent) => void): void
  add_event_listener(event_type: EventType, cb: (event: GameStartedEvent) => void): void
  add_event_listener(event_type: EventType, cb: (event: NextGameEvent) => void): void
  add_event_listener(event_type: EventType, cb: (event: ReactionResultEvent) => void): void
  add_event_listener(event_type: EventType, cb: (event: PlayerReadyEvent) => void): void
  add_event_listener(event_type: EventType, cb: (event: GameEndedEvent) => void): void
  add_event_listener(event_type: EventType, cb: (event: any) => void): void {
    this.event_listeners[event_type].push(cb)
  }
}

export class API {
  clients: { [key: string]: Client } = {}
  last_serial = 0

  constructor() {
    this.last_serial = parseInt(localStorage.getItem('last_serial') || '0')
  }

  save() {
    localStorage.setItem('last_serial', this.last_serial.toString())
  }

  addClient(name: string, client: Client) {
    this.clients[name] = client
  }

  removeClient(name: string) {
    delete this.clients[name]
  }

  handler(update: ReceivedStatusUpdate<Payload>) {
    const { payload, serial } = update
    console.log(serial)
    this.last_serial = serial
    for (const client of Object.values(this.clients)) {
      for (const listener of client.event_listeners[payload.type]) {
        (listener as any)(payload as any)
      }
    }
  }

  // try to catch up on state at the startup of the app
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

  start_listening() {
    console.log('start listening from', this.last_serial)
    window.webxdc.setUpdateListener(this.handler.bind(this), this.last_serial)
  }

  stop_listening() {
    console.log('stop listening')
    window.webxdc.setUpdateListener(e => console.log('missed event: ', e), this.last_serial)
  }

  sendUpdate(payload: Payload, msg = '') {
    window.webxdc.sendUpdate({
      payload: {
        payload,
      },
    }, msg)
  }
}

export const api = new API()
