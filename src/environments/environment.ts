// Production environment (default build configuration) — Netlify deploys of `main`.
// googleClientId is the PUBLIC OAuth client id (not a secret). Replace the placeholder once
// the OAuth client exists (README → "Google OAuth client"); the login page tells you if you forgot.
export const environment = {
  production: true,
  apiBaseUrl: 'https://pulse-api-898880840502.africa-south1.run.app',
  googleClientId: '898880840502-6qccedb3e85eom5e8oqtsfhg2ihrmark.apps.googleusercontent.com',
};
