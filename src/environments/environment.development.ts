// Development environment — used by `npm start` (ng serve). Hits a pulse-api running on this
// machine (port 8090: 8081 is bookr-api, 8080 is Apache on the dev box — contract §6).
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8090',
  googleClientId: 'REPLACE_WITH_GOOGLE_CLIENT_ID',
};
