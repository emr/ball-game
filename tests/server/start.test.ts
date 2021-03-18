import { initializeServerAndClient, receiveReply, sendAndReceiveReply } from '../helpers';

describe('start game', () => {
  it('wait for opponent when a single client starts', async () => {
    expect.assertions(1);

    // setup
    const { server, clients: [client] } = await initializeServerAndClient({ clients: 1 });

    await expect(sendAndReceiveReply(client, '{"start":true}')).resolves.toBe('{"state":"finding_opponent"}\r\n');

    // teardown
    client.destroy();
    server.close();
  });

  it('match clients when multiple clients start', async () => {
    expect.assertions(3);

    // setup
    const { server, clients } = await initializeServerAndClient({ clients: 2 });

    await expect(sendAndReceiveReply(clients[0], '{"start":true}')).resolves.toBe('{"state":"finding_opponent"}\r\n');

    await Promise.all([
      expect(receiveReply(clients[0])).resolves.toBe('{"state":"opponent_found"}\r\n'),
      expect(sendAndReceiveReply(clients[1], '{"start":true}')).resolves.toBe('{"state":"finding_opponent"}\r\n{"state":"opponent_found"}\r\n'),
    ]);

    // teardown
    clients.forEach((c) => c.destroy());
    server.close();
  });
});
