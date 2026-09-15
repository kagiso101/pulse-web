/** Contract §2.5 — Prospects. */
export type ProspectStatus =
  'to_contact' | 'contacted' | 'demo_booked' | 'pilot' | 'tenant' | 'declined';

export interface Prospect {
  id: string;
  name: string;
  business: string | null;
  phone: string | null;
  area: string | null;
  hasWebsite: boolean | null;
  status: ProspectStatus;
  nextAction: string | null;
  nextActionDate: string | null /* YYYY-MM-DD */;
  notes: string | null;
  updatedAt: string;
  overdue: boolean;
}

export interface ProspectUpsert {
  name: string;
  business?: string | null;
  phone?: string | null;
  area?: string | null;
  hasWebsite?: boolean | null;
  status?: ProspectStatus;
  nextAction?: string | null;
  nextActionDate?: string | null;
  notes?: string | null;
}

export interface ProspectNextAction {
  nextAction: string | null;
  nextActionDate: string | null;
}

/** `POST /api/prospects/import` result. */
export interface ProspectImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

/** Pipeline order (spec §5.6). */
export const PROSPECT_STATUSES: readonly ProspectStatus[] = [
  'to_contact',
  'contacted',
  'demo_booked',
  'pilot',
  'tenant',
  'declined',
];

export const PROSPECT_STATUS_LABELS: Record<ProspectStatus, string> = {
  to_contact: 'To contact',
  contacted: 'Contacted',
  demo_booked: 'Demo booked',
  pilot: 'Pilot',
  tenant: 'Tenant',
  declined: 'Declined',
};
