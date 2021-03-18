import { EventEmitter } from 'events';
import MoveHandler from './moveHandler';
import { Player } from './geometry/objects';
import { createField } from './geometry';
import { Player1StartingPoint, Player2StartingPoint } from './geometry/area';
import { GameState, GameStateChangeset } from './gameState';
import Move from './move';

type PlayerObjectId = 'player1'|'player2';

export default class Game {
  private readonly eventEmitter = new EventEmitter();

  private changeset: GameStateChangeset = {};

  public readonly state: GameState = {
    field: createField(),
    time: 0,
    over: false,
  };

  private readonly players: { [key: string]: PlayerObjectId };

  private readonly tickRate: number;

  private startTime!: number;

  private frame = 0;

  constructor(tick: number, players: string[]) {
    this.tickRate = tick;
    this.players = {
      [players[0]]: 'player1',
      [players[1]]: 'player2',
    };

    const player1Object = new Player('player1');
    this.state.field.addObject(
      player1Object,
      Player1StartingPoint.placeObject(
        this.state.field,
        player1Object,
      ),
    );

    const player2Object = new Player('player2');
    this.state.field.addObject(
      player2Object,
      Player2StartingPoint.placeObject(
        this.state.field,
        player2Object,
      ),
    );
  }

  /**
   * Starts the game loop.
   */
  start = () => this.loop();

  subscribe = (listener: (state: GameStateChangeset) => void) => {
    this.eventEmitter.on('state_changed', listener);
  };

  handleMove = (move: Move, player: string) => this.addChangeset(
    MoveHandler.handle(move, player, this.state),
  );

  playerObjectId = (playerId: string): PlayerObjectId => this.players[playerId];

  private addChangeset = (changeset: GameStateChangeset) => {
    this.changeset = { ...this.changeset, ...changeset };
  };

  private loop = () => {
    if (!this.startTime) {
      this.startTime = Date.now();
    }

    this.updateState();
    this.scheduleNextUpdate();
    this.frame += 1;
  };

  private updateState = () => {
    const time = Date.now() - this.startTime;
    this.state.time = time;
    this.addChangeset({
      time,
    });
    this.eventEmitter.emit('state_changed', this.changeset);
    this.changeset = {};
  };

  private scheduleNextUpdate = () => {
    let schedule = 1000 / this.tickRate;
    schedule -= this.state.time - schedule * this.frame;
    setTimeout(this.loop, schedule);
  };
}
