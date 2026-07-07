/**
 * Minimal data-fetching hook that mirrors react-firebase-hooks' `[data, loading,
 * error]` tuple, so Firestore reads can be swapped for `configs/api` calls with
 * little churn. Refetches when `deps` change; ignores stale responses on unmount.
 * (No caching/refetch-on-focus — the pages that need liveness poll explicitly.)
 */
import { useEffect, useState, type DependencyList } from 'react';

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList,
): [T | undefined, boolean, Error | undefined] {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(undefined);
    fetcher()
      .then((result) => {
        if (!active) return;
        setData(result);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e : new Error(String(e)));
        setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [data, loading, error];
}
