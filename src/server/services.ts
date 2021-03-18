import ChannelRegistry from './channelRegistry';
import Matchmaker from './matchmaker';
import MessageHandler from './messageHandler';
import GameRegistry from './gameRegistry';
import startHandler from './messageHandler/start';
import readyHandler from './messageHandler/ready';
import moveHandler from './messageHandler/move';

interface Params {
  serverTickRate: number
}

export interface ServiceContainer {
  params: Params,
  channelRegistry: ChannelRegistry,
  matchmaker: Matchmaker,
  messageHandler: MessageHandler,
  gameRegistry: GameRegistry,
}

export const buildServiceContainer = (params: Params): ServiceContainer => {
  const channelRegistry = new ChannelRegistry();
  const matchmaker = new Matchmaker(channelRegistry);
  const messageHandler = new MessageHandler();
  const gameRegistry = new GameRegistry();

  const messageHandlers = [
    startHandler(matchmaker, gameRegistry, params.serverTickRate),
    readyHandler(gameRegistry),
    moveHandler(gameRegistry),
  ];
  messageHandlers.forEach((h) => messageHandler.register(h));

  return {
    params,
    channelRegistry,
    matchmaker,
    messageHandler,
    gameRegistry,
  };
};
