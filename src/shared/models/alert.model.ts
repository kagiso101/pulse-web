/** Contract §2.4 — Alerts. */
export type AlertKind =
  | 'deposit_paid'
  | 'founder_seat_claimed'
  | 'site_down'
  | 'email_failures'
  | 'tenant_grace'
  | 'prospect_overdue'
  // OPS-VISIBILITY (2026-09-30): one kind per Bookvas platform event type
  | 'checkout_stalled'
  | 'payment_provider_degraded'
  | 'signup_rate_limited'
  | 'plan_price_changed'
  | 'merchant_verification_stalled';

export type Channel = 'whatsapp' | 'email' | 'in_app';

export interface AlertRule {
  id: string;
  projectId: string | null;
  kind: AlertKind;
  threshold: number | null;
  channel: Channel;
  enabled: boolean;
  label: string;
}

export interface AlertRuleUpdate {
  enabled: boolean;
  threshold: number | null;
  channel: Channel;
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  kind: AlertKind;
  projectId: string | null;
  firedAt: string;
  payload: Record<string, unknown>;
  delivered: boolean;
  acknowledgedAt: string | null;
  title: string;
  detail: string;
}

export const CHANNELS: readonly Channel[] = ['whatsapp', 'email', 'in_app'];

export const CHANNEL_LABELS: Record<Channel, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  in_app: 'In-app',
};
