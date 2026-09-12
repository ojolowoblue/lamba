export interface EnvVariable {
  key: string;
  value: any;
  defaultValue: any;
  isOverridden: boolean;
  isSecret?: boolean;
}

export interface PresetProfile {
  id: string;
  name: string;
  overrides: Record<string, any>;
  createdAt: number;
}

export interface LambaOptions {
  /**
   * Initial environment variable key-values to supply to lamba. Accepts strings, numbers, booleans, objects, etc.
   */
  env?: Record<string, any>;
  
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

  /**
   * Optional prefix filter or array of prefixes to include (e.g. ['VITE_', 'NEXT_PUBLIC_', 'REACT_APP_']).
   * If omitted, null, or empty, ALL environment variable keys are allowed and supported regardless of prefix.
   */
  allowedPrefixes?: string | string[] | RegExp | null;
}


export type EnvChangeListener = (key: string, value: any, isOverridden: boolean) => void;
export type StoreChangeListener = (variables: Record<string, EnvVariable>, presets: PresetProfile[], activePresetId: string | null) => void;
