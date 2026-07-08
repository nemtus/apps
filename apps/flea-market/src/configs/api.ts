/**
 * flea-market Worker のドメインAPI（`/api/flea-market/*`）用の型付きクライアント。
 * Firestore の直接読み書き＋Firebase Storage アップロードを置き換える。Cookie を送る
 * （`credentials: 'include'`）ので Better Auth のセッションが同送される。SPA を別オリジンで
 * 配信する場合は `REACT_APP_API_BASE_URL` に Worker のオリジンを設定する。
 */
import type {
  ConfigJson,
  ItemInput,
  ItemJson,
  OrderJson,
  StoreJson,
  UpdateProfileInput,
  UpsertStoreInput,
  UserJson,
} from '../types/domain';

const API_BASE = (import.meta.env.REACT_APP_API_BASE_URL as string | undefined) ?? '';
const PREFIX = `${API_BASE}/api/flea-market`;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PREFIX}${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    let error = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) error = body.error;
    } catch {
      /* JSON 以外のエラーボディ */
    }
    throw new ApiError(res.status, error);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  getConfig: () => req<ConfigJson>('/config'),

  // 公開ブラウズ
  listStores: () => req<StoreJson[]>('/stores'),
  getStore: (storeId: string) => req<StoreJson>(`/stores/${encodeURIComponent(storeId)}`),
  listStoreItems: (storeId: string) => req<ItemJson[]>(`/stores/${encodeURIComponent(storeId)}/items`),
  getStoreItem: (storeId: string, itemId: string) =>
    req<ItemJson>(`/stores/${encodeURIComponent(storeId)}/items/${encodeURIComponent(itemId)}`),

  // ログイン中ユーザー（プロフィール＋KYC）
  getMe: () => req<UserJson>('/me'),
  updateMe: (body: UpdateProfileInput) => req<UserJson>('/me', { method: 'PUT', body: JSON.stringify(body) }),

  // オーナーの店舗・商品
  getMyStore: () => req<StoreJson>('/me/store'),
  upsertMyStore: (body: UpsertStoreInput) => req<StoreJson>('/me/store', { method: 'PUT', body: JSON.stringify(body) }),
  listMyItems: () => req<ItemJson[]>('/me/store/items'),
  createMyItem: (body: ItemInput) => req<ItemJson>('/me/store/items', { method: 'POST', body: JSON.stringify(body) }),
  updateMyItem: (itemId: string, body: ItemInput) =>
    req<ItemJson>(`/me/store/items/${encodeURIComponent(itemId)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // 注文
  listMyOrders: () => req<OrderJson[]>('/me/orders'),
  listMyStoreOrders: () => req<OrderJson[]>('/me/store/orders'),
  getOrder: (orderId: string) => req<OrderJson>(`/orders/${encodeURIComponent(orderId)}`),
  /** 注文＋Stripe Checkout セッションを作成し、購入者を `url` にリダイレクトする。 */
  createOrder: (body: { itemId: string; quantity?: number }) =>
    req<{ orderId: string; url: string }>('/orders', { method: 'POST', body: JSON.stringify(body) }),

  /** 店舗/商品画像を R2 にアップロードし、`/api/flea-market/files/<key>` のURLを返す。 */
  async uploadImage(
    target: { scope: 'store' } | { scope: 'item'; itemId: string },
    file: Blob,
  ): Promise<{ key: string; url: string }> {
    const qs = target.scope === 'item' ? `?scope=item&itemId=${encodeURIComponent(target.itemId)}` : '?scope=store';
    const res = await fetch(`${PREFIX}/me/uploads${qs}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': file.type },
      body: file,
    });
    if (!res.ok) throw new ApiError(res.status, res.statusText);
    return (await res.json()) as { key: string; url: string };
  },
};
