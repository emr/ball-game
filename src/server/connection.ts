import { Socket } from 'net';
// eslint-disable-next-line import/no-cycle
import Channel from './channel';

export enum ConnectionState {
  IDLE = 'idle',
  MATCHMAKING = 'matchmaking',
  NOT_READY = 'not_ready',
  READY = 'ready',
  PLAYING = 'playing',
}

export class Connection {
  constructor(
    public readonly id: string,
    public readonly socket: Socket,
    public channel: Channel,
    public state: ConnectionState,
  ) {}

  setChannel = (channel: Channel) => {
    this.channel = channel;
  };

  setState = (state: ConnectionState) => {
    this.state = state;
  };
}
