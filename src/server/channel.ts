// eslint-disable-next-line import/no-cycle
import { Connection } from './connection';

export default class Channel {
  public readonly connections: Connection[] = [];

  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  add = (conn: Connection) => {
    if (conn.channel === this) {
      return;
    }
    conn.channel.remove(conn);
    this.connections.push(conn);
    conn.setChannel(this);
  };

  remove = (conn: Connection) => {
    const index = this.connections.findIndex((c) => c === conn);
    if (index !== -1) {
      this.connections.splice(index, 1);
    }
  };
}
