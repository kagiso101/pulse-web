import { UpState } from './project.model';

/** Contract §3 — `GET /api/public/client-view/{token}`. */
export interface ClientView {
  name: string;
  siteUrl: string | null;
  status: UpState;
  uptimePct30d: number | null;
  traffic: {
    series: { date: string; activeUsers: number; sessions: number }[];
    topPages: { path: string; views: number }[];
  } | null;
  generatedAt: string;
}
