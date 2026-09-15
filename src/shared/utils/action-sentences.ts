import { PendingAction } from '../models/action.model';
import { TenantRow } from '../models/dashboard.model';

/**
 * Every action opens a ConfirmSheet stating exactly what will happen (spec §5.5). These build
 * the PendingAction — title + one plain-language sentence — for each action Pulse can take.
 */

export function extendGraceAction(tenant: TenantRow, days = 5): PendingAction | null {
  if (!tenant.subscriptionId) return null;
  return {
    kind: 'extend-grace',
    subscriptionId: tenant.subscriptionId,
    days,
    title: 'Extend grace period',
    sentence: `Extend ${possessive(tenant.businessName)} grace period by ${days} days on Bookvas.`,
  };
}

export function compPeriodAction(tenant: TenantRow, days = 30): PendingAction | null {
  if (!tenant.subscriptionId) return null;
  return {
    kind: 'comp-period',
    subscriptionId: tenant.subscriptionId,
    days,
    title: 'Comp a period',
    sentence: `Give ${tenant.businessName} ${days} days of Bookvas free — their paid period moves out by ${days} days.`,
  };
}

export function toggleFounderAction(tenant: TenantRow): PendingAction {
  return {
    kind: 'toggle-founder',
    tenantId: tenant.tenantId,
    title: tenant.isFounder ? 'Remove founder status' : 'Grant founder status',
    sentence: tenant.isFounder
      ? `Remove ${possessive(tenant.businessName)} founder status on Bookvas — they lose the founder price lock.`
      : `Make ${tenant.businessName} a founder on Bookvas — they get the founder price lock and use one founder seat.`,
  };
}

export function restartCloudRunAction(service: string): PendingAction {
  return {
    kind: 'cloud-run-restart',
    service,
    title: `Restart ${service}`,
    sentence: `Roll a new Cloud Run revision of ${service} from its current image. Traffic moves to it once it is healthy; in-flight requests finish on the old one.`,
  };
}

export function redeployNetlifyAction(siteId: string, projectName: string): PendingAction {
  return {
    kind: 'netlify-redeploy',
    siteId,
    title: `Redeploy ${projectName}`,
    sentence: `Trigger a fresh Netlify build and deploy of ${projectName} (site ${siteId}) from its production branch.`,
  };
}

function possessive(name: string): string {
  return name.endsWith('s') ? `${name}'` : `${name}'s`;
}
