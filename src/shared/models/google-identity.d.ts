/**
 * Minimal typing for the Google Identity Services script (https://accounts.google.com/gsi/client).
 * Only what Pulse touches — the ID-token button flow. Kept as a global so the loaded script's
 * `window.google` is type-checked without pulling in a types package.
 */
interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  ux_mode?: 'popup' | 'redirect';
  use_fedcm_for_prompt?: boolean;
  itp_support?: boolean;
}

interface GsiButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
  locale?: string;
}

interface GoogleAccountsId {
  initialize(config: GoogleIdConfiguration): void;
  renderButton(parent: HTMLElement, options: GsiButtonConfiguration): void;
  prompt(): void;
  disableAutoSelect(): void;
  cancel(): void;
}

interface GoogleIdentity {
  accounts: { id: GoogleAccountsId };
}

interface Window {
  google?: GoogleIdentity;
}
