import { ReadyMessage } from '../message/incoming';
import {
  GameStartedMessage,
  GameStateUpdateMessage,
  OutgoingMessage,
  send,
} from '../message/outgoing';
import { Connection, ConnectionState } from '../connection';
import GameRegistry from '../gameRegistry';
import { MessageHandlerRegisterArgs } from '../messageHandler';

const sendToConnections = (connections: Connection[], msg: OutgoingMessage) => {
  connections.forEach((c) => send(c.socket, msg));
};

const readyHandler = (gameRegistry: GameRegistry): MessageHandlerRegisterArgs<ReadyMessage> => ({
  handles: (msg) => msg instanceof ReadyMessage,
  handler: async (conn) => {
    const { channel } = conn;
    const { connections } = channel;
    conn.setState(ConnectionState.READY);
    const game = gameRegistry.get(channel);
    if (!connections.every((c) => c.state === ConnectionState.READY)) {
      return;
    }
    connections.forEach((c) => c.setState(ConnectionState.PLAYING));
    game.start();
    sendToConnections(connections, new GameStartedMessage(game.state));
    game.subscribe((changeset) => {
      sendToConnections(connections, new GameStateUpdateMessage(changeset));
    });
  },
});

export default readyHandler;
