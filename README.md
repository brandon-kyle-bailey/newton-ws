# Websocket demo

## Screenshot
![Screenshot from 2025-02-23 02-15-09](https://github.com/user-attachments/assets/40c5ac8e-f9a6-4dd1-9924-0adf71502e60)

## What's inside?

This Turborepo includes the following apps:

### Apps

- `api`: a [Nest.js](https://nestjs.com/) app that servers as the backend websocket api
- `web`: a [Next.js](https://nextjs.org/) app that serves as a client for the websocket

### Installation and setup

Run the following commands in order:

```bash
git clone git@github.com:brandon-kyle-bailey/newton-ws.git

cd ./newton-ws

npm install

npm run dev
```

### Using Redis

If you would like to leverage the configured RedisIO adapter:

- ensure you have docker and docker compose installed
- navigate to `apps/api`
- run `npm run start:infrastructure`
- Uncomment the adapter hookup in `apps/api/src/main.ts`:

```typescript

import { RedisIoAdapter } from './modules/market-rates/redis-io.adapter';

...

const redisIoAdapter = new RedisIoAdapter(app);
await redisIoAdapter.connectToRedis();
app.useWebSocketAdapter(redisIoAdapter);
app
  .getHttpAdapter()
  .getInstance()
  .on("close", async () => {
    await redisIoAdapter.disconnectRedis();
  });

...
```
