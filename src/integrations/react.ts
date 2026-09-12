import { useState, useEffect } from "react";
import { lamba } from "../index";

/**
 * React Hook for consuming reactive environment variables updated by lamba.
 *
 * @param key The environment variable key name (e.g. 'API_BASE_URL')
 * @param defaultValue Fallback value if the variable is not set
 * @returns Current active environment variable value
 */
export function useLambaEnv<T = any>(key: string, defaultValue?: T): T {
  const [value, setValue] = useState<T>(() =>
    lamba.get<T>(key, defaultValue as T),
  );

  useEffect(() => {
    // Sync current value in case it changed prior to mount
    setValue(lamba.get<T>(key, defaultValue as T));

    // Subscribe to store changes for this key
    const unsubscribe = lamba.onChange((changedKey: string) => {
      if (changedKey === key) {
        setValue(lamba.get<T>(key, defaultValue as T));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [key, defaultValue]);

  return value;
}
