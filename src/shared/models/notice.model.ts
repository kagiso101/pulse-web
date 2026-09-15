/** Contract §2.12 — Notices (in-app, e.g. GA4 auto-discovery). */
export type NoticeKind = 'project_discovered' | 'connector_error' | 'info';

export interface Notice {
  id: string;
  kind: NoticeKind;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  href: string | null;
}
