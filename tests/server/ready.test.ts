import { initializeServerAndClient, sendAndReceiveReply } from '../helpers';

describe('handle ready and start the game', () => {
  it('start game when the clients are ready', async () => {
    expect.assertions(6);

    // setup
    const { server, clients } = await initializeServerAndClient({ clients: 2 });

    const expectedReply = {
      state: 'started',
      gameState: {
        field: {
          objects: {
            player1: {
              object: {
                id: 'player1',
                width: 10,
                height: 1,
              },
              position: { x: 50, y: 2.5 },
            },
            player2: {
              object: {
                id: 'player2',
                width: 10,
                height: 1,
              },
              position: { x: 50, y: 197.5 },
            },
          },
          width: 100,
          height: 200,
        },
        over: false,
      },
    };

    await Promise.all(clients.map(async (client) => {
      await sendAndReceiveReply(client, '{"start":true}');
      const {
        state,
        gameState: {
          time,
          ...gameState
        },
      } = JSON.parse(
        await sendAndReceiveReply(client, '{"ready":true}'),
      );
      expect(state).toBe(expectedReply.state);
      expect(gameState).toStrictEqual(expectedReply.gameState);
      expect(time).toBeLessThan(10);
    }));

    // teardown
    clients.forEach((c) => c.destroy());
    server.close();
  });
});
