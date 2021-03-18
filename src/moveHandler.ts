import Move, { MoveDirectionType } from './move';
import { GameState, GameStateChangeset } from './gameState';

export default class MoveHandler {
  static handle = (move: Move, player: string, state: GameState): GameStateChangeset => {
    if (state.over) {
      return {};
    }

    const { position } = state.field.objects[player];

    switch (move.direction) {
      case MoveDirectionType.LEFT:
        position.x -= 1;
        break;
      case MoveDirectionType.RIGHT:
        position.x += 1;
        break;
      default:
    }

    state.field.updateObjectPosition(player, position);

    return {
      field: {
        objects: {
          [player]: { position },
        },
      },
    };
  };
}
