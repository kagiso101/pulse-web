import { DeployEvent } from '../../../shared/models/deploy.model';

export interface DeploysState {
  items: DeployEvent[];
  projectId: string | null;
  loading: boolean;
  error: string | null;
}

export const initialDeploysState: DeploysState = {
  items: [],
  projectId: null,
  loading: false,
  error: null,
};
