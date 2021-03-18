import * as net from 'net';
import { AddressInfo } from 'net';
import { OutgoingMessage } from '../message/outgoing';
import { Connection, ConnectionState } from '../connection';
import Channel from '../channel';

const identifyConnection = ({ remoteAddress, remotePort }: net.Socket) => `${remoteAddress}:${remotePort}`;

type MessageListener = (connection: Connection, message: Buffer) => void;

export default abstract class Server {
  protected server: net.Server;

  private messageListener?: MessageListener;

  protected constructor(server: net.Server, channel: Channel) {
    this.server = server;
    this.server.on('connection', (socket) => {
      const id = identifyConnection(socket);
      const conn = new Connection(id, socket, channel, ConnectionState.IDLE);

      socket.on('data', (msg) => this.handleMessage(conn, msg));
      socket.on('close', () => this.handleClose(conn));

      channel.add(conn);
    });
  }

  abstract send(conn: Connection, msg: OutgoingMessage): void;

  listen = (
    port?: number,
    hostname?: string,
    onListening?: ((address: AddressInfo) => void),
  ) => {
    this.server.listen(port, hostname);
    this.server.on('listening', () => {
      if (onListening) {
        onListening(this.address());
      }
    });
  };

  close = () => this.server.close();

  onMessage = (listener: MessageListener) => {
    this.messageListener = listener;
  };

  onListening = (listener: () => void) => this.server.on('listening', listener);

  onError = (listener: (err: Error) => void) => this.server.on('error', listener);

  address = (): AddressInfo => {
    const address = this.server.address();
    if (address && typeof address === 'object') {
      return address;
    }
    throw new Error('Cannot get address info of the server.');
  };

  private handleClose = (conn: Connection) => conn.channel.remove(conn);

  private handleMessage = (conn: Connection, msg: Buffer) => {
    console.log(msg.toString());
    if (this.messageListener) {
      this.messageListener(conn, msg);
    }
  };
}
