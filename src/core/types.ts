export interface EnvVariable {
  key: string;
  value: string;
  defaultValue: string;
  isOverridden: boolean;
  isSecret?: boolean;
}

export interface PresetProfile {
  id: string;
  name: string;
  overrides: Record<string, string>;
  createdAt: number;
}

export interface LambaOptions {
  /**
   * Initial environment variable key-values to supply to lamba.
   */
  env?: Record<string, string>;
  
  /**
   * Whether lamba floating UI is enabled. Defaults to true in non-production or when specified.
   */
  enabled?: boolean;
  
  /**
   * Position of the floating launcher button.
   * Options: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
   * Defaults to 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /**
   * Secret keys regex pattern to automatically mask in the UI (e.g. API_KEY, SECRET, TOKEN, PASSWORD).
   */
  secretKeysPattern?: RegExp;

  /**
   * Whether to attempt auto-fetching `/.env` or `/.env.example` file in dev mode.
   * Defaults to true.
   */
  autoFetchEnvFile?: boolean;

  /**
   * Whether to implicitly intercept fetch and XHR requests and rewrite default base URLs
   * to overridden active environment URLs automatically.
   * Defaults to true.
   */
  interceptNetworkRequests?: boolean;
}


export type EnvChangeListener = (key: string, value: string, isOverridden: boolean) => void;
export type StoreChangeListener = (variables: Record<string, EnvVariable>, presets: PresetProfile[], activePresetId: string | null) => void;
