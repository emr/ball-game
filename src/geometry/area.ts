import { GameObject } from './objects';
import { GameField, Point } from './index';

export class Player1StartingPoint {
  static placeObject = (field: GameField, object: GameObject): Point => ({
    x: field.width / 2,
    y: field.height * 0.01 + object.height / 2,
  });
}

export class Player2StartingPoint {
  static placeObject = (field: GameField, object: GameObject): Point => ({
    x: field.width / 2,
    y: field.height * 0.99 - object.height / 2,
  });
}
