export const simpleConfig = {
  dataSource: {
    url: `https://api.coingecko.com/api/v3/coins/markets`,
    currency: 'cad',
  },
  ws: {
    // NOTE: interval set to 13 seconds to match the interval of the market rates service rate limit (5-15 coingecko api calls per 60 seconds)
    interval: 13000,
    host: 'localhost',
    port: 5000,
    namespace: 'markets',
    path: '/ws',
    cors: {
      origin: '*',
    },
  },
  redis: {
    host: 'localhost',
    port: '6379',
  },
};

