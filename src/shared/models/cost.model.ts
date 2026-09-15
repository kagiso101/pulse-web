/** Contract §2.6 — Costs. */
export type Provider = 'gcp' | 'netlify' | 'brevo' | 'payfast' | 'other';

export interface CostReport {
  month: string /* YYYY-MM */;
  totalCents: number;
  byProvider: {
    provider: Provider;
    amountCents: number;
    source: 'connector' | 'manual';
    capturedAt: string;
  }[];
  trend: { month: string; totalCents: number }[] /* last 6 months */;
}

export interface ManualCost {
  provider: Provider;
  month: string;
  amountCents: number;
}

export const PROVIDERS: readonly Provider[] = ['gcp', 'netlify', 'brevo', 'payfast', 'other'];

export const PROVIDER_LABELS: Record<Provider, string> = {
  gcp: 'Google Cloud',
  netlify: 'Netlify',
  brevo: 'Brevo',
  payfast: 'PayFast',
  other: 'Other',
};
