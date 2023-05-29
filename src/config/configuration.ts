export default () => ({
  PORT: Number(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV,
  TOKEN_AUTH_JWT: process.env.TOKEN_AUTH_JWT,
  TOKEN_AUTH_EXP_IN_DAY: 1,
  TOKEN_REFRESH_AUTH_JWT: process.env.TOKEN_REFRESH_AUTH_JWT,
  TOKEN_REFRESH_AUTH_EXP_IN_DAY: 365,

  SESSION_AUTH_JWT: process.env.SESSION_AUTH_JWT,
  RECEIVED_WINDOW_TIMEOUT: 10,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  EXPO_PUSH_TOKEN: process.env.EXPO_PUSH_TOKEN,

  SENTRY: { DSN: process.env.SENTRY_DSN },
  DEV_ORIGINS: ['http://localhost:3300', 'http://localhost:3400'],
  PROD_ORIGINS: ['https://master.wirehard.xyz'],
});
