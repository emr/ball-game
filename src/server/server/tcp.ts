import { createServer } from 'net';
import { Connection } from '../connection';
import { OutgoingMessage } from '../message/outgoing';
import Server from './server';
import Channel from '../channel';

export default class TcpServer extends Server {
  constructor(channel: Channel) {
    super(createServer(), channel);
  }

  send = ({ socket }: Connection, msg: OutgoingMessage) => {
    socket.write(`${JSON.stringify(msg)}\r\n`);
  };
}
