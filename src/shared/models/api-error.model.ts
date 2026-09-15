/** Contract §0.3 — every error body from pulse-api. */
export interface ApiError {
  status: 'error';
  message: string;
  code?: string;
}
