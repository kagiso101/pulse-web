// SIT environment — Netlify branch deploys of `development` (`npm run build:sit`, netlify.toml).
// Same optimised production build, pointed at the pulse-api-sit Cloud Run service.
export const environment = {
  production: false,
  apiBaseUrl: 'https://pulse-api-sit-898880840502.africa-south1.run.app',
  googleClientId: '898880840502-6qccedb3e85eom5e8oqtsfhg2ihrmark.apps.googleusercontent.com',
};
