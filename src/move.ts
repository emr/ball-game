export enum MoveDirectionType {
  LEFT = 'left',
  RIGHT = 'right',
}

export default class Move {
  constructor(public direction: MoveDirectionType) {}
}
