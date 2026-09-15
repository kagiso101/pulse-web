// SIT environment — Netlify branch deploys of `development` (`npm run build:sit`, netlify.toml).
// Same optimised production build, pointed at the pulse-api-sit Cloud Run service.
export const environment = {
  production: false,
  apiBaseUrl: 'https://pulse-api-sit-898880840502.africa-south1.run.app',
  googleClientId: 'REPLACE_WITH_GOOGLE_CLIENT_ID',
};
