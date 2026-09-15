/** Contract §1 — `POST /api/auth/google` response. */
export interface AuthResponse {
  token: string;
  expiresIn: number /* seconds */;
  email: string;
}

/** Contract §1 — `GET /api/auth/me`. */
export interface MeResponse {
  email: string;
}
