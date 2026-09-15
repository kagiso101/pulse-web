import { ProjectDashboard } from '../../../shared/models/dashboard.model';
import { Range } from '../../../shared/models/range.model';

export interface DashboardState {
  /** Keyed by `${slug}|${range}` so switching pills/ranges shows cached data instantly. */
  byKey: Record<string, ProjectDashboard>;
  currentKey: string | null;
  loading: boolean;
  error: string | null;
}

export const initialDashboardState: DashboardState = {
  byKey: {},
  currentKey: null,
  loading: false,
  error: null,
};

export function dashboardKey(slug: string, range: Range): string {
  return `${slug}|${range}`;
}

export function parseDashboardKey(key: string): { slug: string; range: Range } | null {
  const [slug, range] = key.split('|');
  if (!slug || (range !== 'today' && range !== '7d' && range !== '30d')) return null;
  return { slug, range };
}
