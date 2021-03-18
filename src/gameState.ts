import { GameField, GameFieldChangeset } from './geometry';
import { Time } from './engine/physics';

export interface GameState {
  field: GameField,
  time: Time,
  over: boolean,
}

export interface GameStateChangeset {
  field?: GameFieldChangeset,
  time?: Time,
  over?: boolean,
}
