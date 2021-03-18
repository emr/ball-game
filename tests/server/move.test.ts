import { initializeServerAndClient, receiveReply, sendAndReceiveReply } from '../helpers';
import { GameState } from '../../src/gameState';
import { GameStateUpdateMessage } from '../../src/server/message/outgoing';

describe('handle player moves', () => {
  it('receive game state changesets', async () => {
    expect.assertions(8);

    // setup
    const { server, clients } = await initializeServerAndClient({
      serverOpts: {
        tickRate: 1,
      },
      clients: 2,
    });

    // make clients match
    // clients must start sequentially for the test case
    await sendAndReceiveReply(clients[0], '{"start":true}');
    await sendAndReceiveReply(clients[1], '{"start":true}');
    await receiveReply(clients[0]);

    // make clients ready and get the initial states
    const initialStates: GameState[] = await Promise.all(clients.map(async (client) => {
      const reply = await sendAndReceiveReply(client, '{"ready":true}');
      const { gameState } = JSON.parse(reply);
      return gameState;
    }));

    {
      // make move in the name of client 1 and take the changesets
      const changesets: GameStateUpdateMessage[] = (await Promise.all([
        sendAndReceiveReply(clients[0], '{"move":"left"}'),
        receiveReply(clients[1]),
      ])).map((r) => JSON.parse(r));

      const { gameStateChangeset } = changesets[0];
      // according to tick rate, which is defined at the top of the test,
      // current time should be at least around 1 second
      expect(gameStateChangeset.time).not.toBeNaN();
      expect(gameStateChangeset.time! - initialStates[0].time).toBeGreaterThanOrEqual(1000);
      // player1 position should be updated
      const expectedPosition = initialStates[0].field.width / 2 - 1;
      expect(gameStateChangeset?.field?.objects?.player1?.position?.x).not.toBeNaN();
      expect(gameStateChangeset!.field!.objects!.player1!.position!.x).toBe(expectedPosition);
      // the changeset sent to player 2 should be same as that sent to player 1
      expect(changesets[1]).toStrictEqual(changesets[0]);
    }

    // make one more move
    {
      const changesets: GameStateUpdateMessage[] = (await Promise.all([
        sendAndReceiveReply(clients[1], '{"move":"right"}'),
        receiveReply(clients[0]),
      ])).map((r) => JSON.parse(r));

      const { gameStateChangeset } = changesets[0];
      const expectedPosition = initialStates[0].field.width / 2 + 1;
      expect(gameStateChangeset?.field?.objects?.player2?.position?.x).not.toBeNaN();
      expect(gameStateChangeset!.field!.objects!.player2!.position!.x).toBe(expectedPosition);
      expect(changesets[0]).toStrictEqual(changesets[1]);
    }

    // teardown
    clients.forEach((c) => c.destroy());
    server.close();
  });
});
