import {
  Prospect,
  ProspectImportResult,
  ProspectStatus,
} from '../../../shared/models/prospect.model';

export interface ProspectsState {
  items: Prospect[];
  loaded: boolean;
  loading: boolean;
  /** Ids with an in-flight mutation (per-row busy state). */
  saving: string[];
  creating: boolean;
  error: string | null;
  statusFilter: ProspectStatus | null;
  importing: boolean;
  importResult: ProspectImportResult | null;
}

export const initialProspectsState: ProspectsState = {
  items: [],
  loaded: false,
  loading: false,
  saving: [],
  creating: false,
  error: null,
  statusFilter: null,
  importing: false,
  importResult: null,
};
