// Local environment (`npm run start:local`) — same target as development: a local pulse-api on
// :8090. Kept as a separate file so a developer can point it elsewhere without touching the
// default `ng serve` configuration.
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8090',
  googleClientId: 'REPLACE_WITH_GOOGLE_CLIENT_ID',
};
