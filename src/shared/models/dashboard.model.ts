import { DeployEvent } from './deploy.model';
import { Project, UpState } from './project.model';

/** Contract §2.3 — Project dashboard. */
export interface ProjectDashboard {
  project: Project;
  header: {
    status: UpState;
    uptimePct: number | null;
    lastDeploy: DeployEvent | null;
    latencyMs: number | null;
  };
  traffic: {
    series: { date: string; activeUsers: number; sessions: number; pageViews: number }[];
    topPages: { path: string; views: number }[]; // max 10
    sources: { source: string; sessions: number }[]; // max 10
    keyEvents: { event: string; count: number }[]; // file_download, click, scroll, + funnel events
    available: boolean; // false when no GA4 property / no snapshots yet
  };
  deploys: DeployEvent[]; // latest 10
  bookvas: BookvasSection | null; // only for kind = product
}

export type FunnelEvent = 'booking_started' | 'slot_selected' | 'deposit_initiated' | 'purchase';

export interface BookvasSection {
  funnel: {
    steps: { event: FunnelEvent; count: number | null }[];
    dropoffs: { from: string; to: string; pct: number | null }[];
    stale: boolean;
    note: string | null; // note explains missing events
  };
  revenue: {
    thisMonthCents: number | null;
    lastMonthCents: number | null;
    projectedCents: number | null;
    available: boolean;
  };
  founder: { used: number | null; total: number | null };
  tenants: TenantRow[];
  emailHealth: EmailHealth | null;
  events: PlatformEvent[]; // latest 20 Bookvas platform events
}

export interface EmailHealth {
  sent24h: number;
  failed24h: number;
  sent7d: number;
  failed7d: number;
  lastSentAt: string | null;
  smtpConfigured: boolean;
}

export interface TenantRow {
  tenantId: string;
  slug: string;
  businessName: string;
  status: string;
  subscriptionId: string | null;
  planCode: string | null;
  subscriptionStatus: string | null;
  isFounder: boolean;
  graceUntil: string | null;
  createdAt: string;
}

export interface PlatformEvent {
  id: string;
  happenedAt: string;
  tenantName: string | null;
  eventType: string;
  severity: string;
  message: string;
  resolvedAt: string | null;
}
