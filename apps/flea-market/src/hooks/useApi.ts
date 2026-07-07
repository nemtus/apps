/**
 * react-firebase-hooks の `[data, loading, error]` タプルを模した最小のデータ取得フック。
 * Firestore 読み取りを `configs/api` 呼び出しへ少ない差分で置き換えるためのもの。`deps` が
 * 変わると再取得し、その際は前回の `data` をクリアする（古い店舗/商品を表示したり、失敗後に
 * 前回値が残ったりしないようにするため）。アンマウント後の古いレスポンスは無視する。キャッシュ
 * やフォーカス再取得は行わない（鮮度が必要なページは明示的にポーリングする）。
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
    setData(undefined);
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
