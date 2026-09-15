import { Notice } from '../../../shared/models/notice.model';

export interface NoticesState {
  /** Unread notices only (`GET /api/notices?unread=true`). */
  items: Notice[];
  loading: boolean;
  error: string | null;
  panelOpen: boolean;
}

export const initialNoticesState: NoticesState = {
  items: [],
  loading: false,
  error: null,
  panelOpen: false,
};
