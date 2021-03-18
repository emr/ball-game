import { GameObject } from './objects';

export interface Point {
  x: number,
  y: number,
}

export class GameField {
  objects: { [key: string]: { object: GameObject, position: Point } } = {};

  constructor(public readonly width: number, public readonly height: number) {}

  addObject = (object: GameObject, position: Point) => {
    this.objects[object.id] = { object, position };
  };

  updateObjectPosition = (objectId: string, position: Point) => {
    this.objects[objectId].position = position;
  };
}

export interface GameFieldChangeset {
  width?: number,
  height?: number,
  objects?: {
    [key: string]: {
      object?: GameObject,
      position?: Point
    }
  }
}

export const createField = (): GameField => new GameField(100, 200);
