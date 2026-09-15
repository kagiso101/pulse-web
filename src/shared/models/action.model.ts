/** Contract §2.9 — Actions. */
export interface ActionResult {
  result: 'ok' | 'failed';
  message: string;
  actionLogId: string;
}

export interface ActionLog {
  id: string;
  actorEmail: string;
  action: string;
  target: string;
  payload: Record<string, unknown>;
  result: string;
  at: string;
}

/** Every action body carries `confirm: true` (contract §0.4). */
export interface ConfirmBody {
  confirm: true;
  days?: number;
}

/**
 * A UI-side description of an action awaiting confirmation. The `sentence` is the
 * plain-language line the ConfirmSheet shows ("Extend X's grace period by 5 days on Bookvas.").
 */
export type PendingAction =
  | { kind: 'extend-grace'; subscriptionId: string; days: number; title: string; sentence: string }
  | { kind: 'comp-period'; subscriptionId: string; days: number; title: string; sentence: string }
  | { kind: 'toggle-founder'; tenantId: string; title: string; sentence: string }
  | { kind: 'cloud-run-restart'; service: string; title: string; sentence: string }
  | { kind: 'netlify-redeploy'; siteId: string; title: string; sentence: string };
