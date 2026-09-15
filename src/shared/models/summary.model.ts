/** Contract §2.2 / §2.8 — the 07:00 daily summary. */
export interface DailySummary {
  date: string /* YYYY-MM-DD */;
  body: string;
  sentAt: string | null;
}
