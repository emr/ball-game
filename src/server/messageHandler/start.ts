import { StartMessage } from '../message/incoming';
import { FindingOpponentMessage, OpponentFoundMessage, send } from '../message/outgoing';
import Game from '../../game';
import Matchmaker from '../matchmaker';
import GameRegistry from '../gameRegistry';
import { Connection, ConnectionState } from '../connection';
import { MessageHandlerRegisterArgs } from '../messageHandler';

const startHandler = (
  matchmaker: Matchmaker,
  gameRegistry: GameRegistry,
  tick: number,
): MessageHandlerRegisterArgs<StartMessage> => ({
  handles: (msg) => msg instanceof StartMessage,
  handler: async (conn: Connection) => {
    conn.setState(ConnectionState.MATCHMAKING);
    send(conn.socket, new FindingOpponentMessage());

    const channel = await matchmaker.match(conn);
    if (!channel) {
      return;
    }

    const { connections } = channel;
    connections
      .forEach((c) => {
        send(c.socket, new OpponentFoundMessage());
        c.setState(ConnectionState.NOT_READY);
      });
    const game = new Game(
      tick,
      [connections[0].id, connections[1].id],
    );
    gameRegistry.add(channel, game);
  },
});

export default startHandler;
