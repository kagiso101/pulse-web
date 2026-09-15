// Production environment (default build configuration) — Netlify deploys of `main`.
// googleClientId is the PUBLIC OAuth client id (not a secret). Replace the placeholder once
// the OAuth client exists (README → "Google OAuth client"); the login page tells you if you forgot.
export const environment = {
  production: true,
  apiBaseUrl: 'https://pulse-api-898880840502.africa-south1.run.app',
  googleClientId: 'REPLACE_WITH_GOOGLE_CLIENT_ID',
};
