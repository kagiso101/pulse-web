import { CostReport } from '../../../shared/models/cost.model';
import { currentMonth } from '../../../shared/utils/format';

export interface CostsState {
  report: CostReport | null;
  month: string;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialCostsState: CostsState = {
  report: null,
  month: currentMonth(),
  loading: false,
  saving: false,
  error: null,
};
