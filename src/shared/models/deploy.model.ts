/** Contract §2.7 — Deploys. */
export type DeploySource = 'netlify' | 'cloudrun' | 'github';

export interface DeployEvent {
  id: string;
  projectId: string | null;
  repo: string | null;
  sha: string;
  branch: string | null;
  message: string | null;
  environment: string | null;
  deployedAt: string;
  source: DeploySource;
}
