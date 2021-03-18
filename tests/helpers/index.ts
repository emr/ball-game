import { connect, Socket } from 'net';
import { createTcpServer, ServerOptions, TcpServer } from '../../src/server';

export const setupServer = (opts?: ServerOptions): Promise<TcpServer> => new Promise((resolve) => {
  const server = createTcpServer(opts || { tickRate: 1 });
  server.listen(undefined, undefined, () => resolve(server));
});

export const setupClient = (port: number): Socket => connect({ port });

export const receiveReply = (client: Socket): Promise<string> => new Promise((resolve) => {
  client.once('data', (res) => {
    resolve(res.toString());
  });
});

export const sendAndReceiveReply = (
  client: Socket,
  msg: string,
): Promise<string> => new Promise((resolve) => {
  receiveReply(client).then(resolve);
  client.write(msg);
});

export const initializeServerAndClient = async (
  opts: {
    clients: number,
    serverOpts?: ServerOptions
  },
) => {
  const server = await setupServer(opts?.serverOpts);
  const address = server.address();
  const clients = Array.from({ length: opts.clients })
    .map(() => setupClient(address!.port));

  return { server, clients };
};
