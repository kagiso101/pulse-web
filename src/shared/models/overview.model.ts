import { ProjectKind, UpState } from './project.model';
import { Range } from './range.model';
import { DailySummary } from './summary.model';

/** Contract §2.2 — Overview ("All" view). */
export interface Overview {
  range: Range;
  headline: {
    visitors: number | null; // GA4 activeUsers summed over range, all projects
    bookingsThisWeek: number | null; // null = Bookvas endpoint gap (see contract §5)
    depositsCents: number | null; // null = gap
    founderSeatsUsed: number | null;
    founderSeatsTotal: number | null;
    cvDownloads: number | null; // GA4 file_download events on the portfolio property
    sitesUp: number;
    sitesTotal: number;
  };
  projects: ProjectCard[];
  needsYou: NeedsYouItem[];
  summary: DailySummary | null; // latest 07:00 summary
  lastSnapshotAt: string | null;
}

export type NumberUnit = 'count' | 'cents' | 'pct' | 'ms';

export interface ProjectCardNumber {
  key: string;
  label: string;
  value: number | null;
  unit: NumberUnit;
}

export interface ProjectCard {
  projectId: string;
  slug: string;
  name: string;
  kind: ProjectKind;
  color: string | null;
  numbers: ProjectCardNumber[]; // exactly 3
  sparkline: number[]; // daily activeUsers for the range (7 or 30 points; today → 24 hourly)
  status: UpState;
  openAlerts: number;
}

export interface NeedsYouItem {
  type: 'alert' | 'prospect';
  id: string;
  title: string;
  detail: string;
  since: string;
  projectId: string | null;
  href: string;
}
