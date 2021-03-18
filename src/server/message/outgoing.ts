import { Socket } from 'net';
import { GameState, GameStateChangeset } from '../../gameState';

export interface OutgoingMessage {
}

export class FindingOpponentMessage implements OutgoingMessage {
  state = 'finding_opponent';
}

export class OpponentFoundMessage implements OutgoingMessage {
  state = 'opponent_found';
}

export class GameStartedMessage implements OutgoingMessage {
  state = 'started';

  constructor(public gameState: GameState) {}
}

export class GameStateUpdateMessage implements OutgoingMessage {
  constructor(public gameStateChangeset: GameStateChangeset) {}
}

export const send = (socket: Socket, msg: OutgoingMessage) => {
  socket.write(`${JSON.stringify(msg)}\r\n\r\n`);
};
