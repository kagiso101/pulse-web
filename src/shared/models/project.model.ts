/** Contract §2.1 — Projects (registry). */
export type ProjectKind = 'product' | 'agency' | 'portfolio' | 'client_site';
export type UpState = 'up' | 'down' | 'unknown';

export interface Project {
  id: string;
  slug: string;
  name: string;
  kind: ProjectKind;
  ga4PropertyId: string | null; // numeric GA4 property id as string, e.g. "512345678"
  ga4MeasurementId: string | null; // "G-XXXXXXXXXX" (contract addendum)
  siteUrl: string | null;
  apiHealthUrl: string | null;
  netlifySiteId: string | null;
  cloudRunService: string | null;
  githubRepos: string[]; // "owner/repo"
  color: string | null;
  sortOrder: number;
  active: boolean;
  autoDiscovered: boolean;
  discoveredAt: string | null;
  hasClientViewToken: boolean;
  status: { up: UpState; openAlerts: number; lastSnapshotAt: string | null };
}

export interface ProjectUpsert {
  slug: string;
  name: string;
  kind: ProjectKind;
  ga4PropertyId?: string | null;
  ga4MeasurementId?: string | null;
  siteUrl?: string | null;
  apiHealthUrl?: string | null;
  netlifySiteId?: string | null;
  cloudRunService?: string | null;
  githubRepos?: string[];
  color?: string | null;
  sortOrder?: number;
  active?: boolean;
}

/** `POST /api/projects/{id}/client-view-token` — raw token returned ONCE. */
export interface ClientViewTokenResponse {
  token: string;
  url: string;
}

export const PROJECT_KINDS: readonly ProjectKind[] = [
  'product',
  'agency',
  'portfolio',
  'client_site',
];

export const PROJECT_KIND_LABELS: Record<ProjectKind, string> = {
  product: 'Product',
  agency: 'Agency',
  portfolio: 'Portfolio',
  client_site: 'Client site',
};
