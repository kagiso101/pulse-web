// Development environment — used by `npm start` (ng serve). Hits a pulse-api running on this
// machine (port 8090: 8081 is bookr-api, 8080 is Apache on the dev box — contract §6).
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8090',
  googleClientId: '898880840502-6qccedb3e85eom5e8oqtsfhg2ihrmark.apps.googleusercontent.com',
};
