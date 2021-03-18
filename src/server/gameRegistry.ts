import Game from '../game';
import Channel from './channel';

export default class GameRegistry {
  private games: { [key:string]: Game } = {};

  add = ({ id }: Channel, game: Game) => {
    this.games[id] = game;
  };

  get = ({ id }: Channel): Game => this.games[id];
}
