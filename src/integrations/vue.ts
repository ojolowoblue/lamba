import { ref, onUnmounted, getCurrentInstance, Ref } from "vue";
import { lamba } from "../index";

/**
 * Vue Composable for consuming reactive environment variables updated by lamba.
 *
 * @param key The environment variable key name (e.g. 'API_URL', 'NEXT_PUBLIC_API_URL', 'VITE_API_URL')
 * @param defaultValue Fallback value if the variable is not set
 * @returns Vue Ref string
 */
export function useLambaEnv<T = any>(
  key: string,
  defaultValue?: T,
): Ref<T> {
  const envValue = ref<T>(lamba.get<T>(key, defaultValue as T)) as Ref<T>;

  const unsubscribe = lamba.onChange((changedKey: string) => {
    if (changedKey === key) {
      envValue.value = lamba.get<T>(key, defaultValue as T);
    }
  });

  if (getCurrentInstance()) {
    onUnmounted(() => {
      unsubscribe();
    });
  }

  return envValue;
}
