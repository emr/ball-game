import { v4 as uuid } from 'uuid';
import Channel from './channel';

export default class ChannelRegistry {
  public readonly channels: {
    idle: Channel,
    lobby: Channel,
    sessions: { [key: string]: Channel },
  } = {
    idle: new Channel('idle'),
    lobby: new Channel('lobby'),
    sessions: {},
  };

  create = (): Channel => {
    let id;
    do {
      id = `CH_${uuid()}`;
    } while (Object.hasOwnProperty.call(this.channels.sessions, id));

    this.channels.sessions[id] = new Channel(id);

    return this.channels.sessions[id];
  };

  remove = (channel: Channel) => {
    delete this.channels.sessions[channel.id];
  };
}
