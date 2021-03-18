import { buildServiceContainer } from './services';
import TcpServer from './server/tcp';
import HttpServer from './server/http';

export interface ServerOptions {
  tickRate: number,
}

export const createTcpServer = ({ tickRate }: ServerOptions) => {
  const {
    messageHandler,
    channelRegistry: {
      channels: {
        idle: channel,
      },
    },
  } = buildServiceContainer({ serverTickRate: tickRate });
  const server = new TcpServer(channel);
  server.onMessage(messageHandler.handle);
  return server;
};

export const createHttpServer = ({ tickRate }: ServerOptions) => {
  const {
    messageHandler,
    channelRegistry: {
      channels: {
        idle: channel,
      },
    },
  } = buildServiceContainer({ serverTickRate: tickRate });
  const server = new HttpServer(channel);
  server.onMessage(messageHandler.handle);
  return server;
};

export { TcpServer, HttpServer };
