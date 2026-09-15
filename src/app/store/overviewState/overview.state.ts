import { Overview } from '../../../shared/models/overview.model';
import { Range } from '../../../shared/models/range.model';

export interface OverviewState {
  data: Overview | null;
  /** The range the current `data` was loaded for. */
  range: Range | null;
  loading: boolean;
  error: string | null;
}

export const initialOverviewState: OverviewState = {
  data: null,
  range: null,
  loading: false,
  error: null,
};
