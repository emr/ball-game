import Channel from './channel';
import ChannelRegistry from './channelRegistry';
import { Connection } from './connection';

export default class Matchmaker {
  constructor(private channelRegistry: ChannelRegistry) {}

  match = async (conn: Connection): Promise<Channel | undefined> => {
    const { lobby } = this.channelRegistry.channels;
    const opponent = lobby.connections.find(() => true);
    if (!opponent) {
      lobby.add(conn);
      return undefined;
    }

    const channel = this.channelRegistry.create();
    channel.add(opponent);
    channel.add(conn);

    return channel;
  };
}
