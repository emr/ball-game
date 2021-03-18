export class GameObject {
  constructor(public readonly id: string, public width: number, public height: number) {
    this.id = id;
    this.width = width;
    this.height = height;
  }
}

export class Player extends GameObject {
  constructor(id: string) {
    super(id, 10, 1);
  }
}
