import { createHttpServer } from './server';

const server = createHttpServer({ tickRate: 1 });

server.listen(3000, '0.0.0.0', ({ address, port }) => {
  console.log(`HTTP server is running on ${address}:${port}`);
});

server.onError(({ message, stack }: Error) => {
  console.log(`Server error: ${message}`);
  console.log(stack);
  server.close();
});
