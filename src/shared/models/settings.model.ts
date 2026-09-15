/** Contract §2.11 — Settings. */
export type NotificationChannel = 'whatsapp' | 'email';

export interface Settings {
  allowedEmailMasked: string; // k***@gmail.com
  notificationChannel: NotificationChannel; // default channel for rules that say whatsapp when WhatsApp is not configured
  whatsappConfigured: boolean;
  emailConfigured: boolean;
  ga4Configured: boolean;
  bookvasConfigured: boolean;
  netlifyConfigured: boolean;
  cloudRunConfigured: boolean;
  billingConfigured: boolean;
  anthropicConfigured: boolean;
  timezone: 'Africa/Johannesburg';
}

export interface SettingsUpdate {
  notificationChannel: NotificationChannel;
}

/** The connector flags on Settings, in display order, with their labels. */
export const CONNECTOR_FLAGS: readonly { key: keyof Settings; label: string }[] = [
  { key: 'ga4Configured', label: 'GA4' },
  { key: 'bookvasConfigured', label: 'Bookvas' },
  { key: 'netlifyConfigured', label: 'Netlify' },
  { key: 'cloudRunConfigured', label: 'Cloud Run' },
  { key: 'billingConfigured', label: 'Billing' },
  { key: 'emailConfigured', label: 'Email' },
  { key: 'whatsappConfigured', label: 'WhatsApp' },
  { key: 'anthropicConfigured', label: 'Ask (Anthropic)' },
];
