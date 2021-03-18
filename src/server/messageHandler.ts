import { IncomingMessage, parse } from './message/incoming';
import { Connection } from './connection';

export interface MessageHandlerRegisterArgs<T extends IncomingMessage> {
  handles: (msg?: IncomingMessage) => boolean,
  handler: (conn: Connection, msg: T) => void
}

export default class MessageHandler {
  private handlers: MessageHandlerRegisterArgs<any>[] = [];

  register<T extends IncomingMessage>({ handles, handler }: MessageHandlerRegisterArgs<T>) {
    this.handlers.push({ handles, handler });
  }

  handle = (conn: Connection, msg: Buffer) => {
    const parsed = parse(msg.toString());
    this.handlers.forEach(
      ({ handles, handler }) => {
        if (handles(parsed)) {
          handler(conn, parsed);
        }
      },
    );
  };
}
