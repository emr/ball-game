import { MoveMessage } from '../message/incoming';
import Move from '../../move';
import GameRegistry from '../gameRegistry';
import { MessageHandlerRegisterArgs } from '../messageHandler';

const moveHandler = (gameRegistry: GameRegistry): MessageHandlerRegisterArgs<MoveMessage> => ({
  handles: (msg) => msg instanceof MoveMessage,
  handler: async ({ id, channel }, msg) => {
    const game = gameRegistry.get(channel);
    const move = new Move(msg.direction);
    game.handleMove(move, game.playerObjectId(id));
  },
});

export default moveHandler;
