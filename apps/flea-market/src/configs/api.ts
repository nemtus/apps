/**
 * Typed client for the flea-market Worker domain API (`/api/flea-market/*`),
 * replacing the direct Firestore reads/writes + Firebase Storage uploads. Sends
 * cookies (`credentials: 'include'`) so the Better Auth session rides along; set
 * `REACT_APP_API_BASE_URL` to the Worker origin when the SPA is served elsewhere.
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
      /* non-JSON error body */
    }
    throw new ApiError(res.status, error);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  getConfig: () => req<ConfigJson>('/config'),

  // public browse
  listStores: () => req<StoreJson[]>('/stores'),
  getStore: (storeId: string) => req<StoreJson>(`/stores/${encodeURIComponent(storeId)}`),
  listStoreItems: (storeId: string) => req<ItemJson[]>(`/stores/${encodeURIComponent(storeId)}/items`),
  getStoreItem: (storeId: string, itemId: string) =>
    req<ItemJson>(`/stores/${encodeURIComponent(storeId)}/items/${encodeURIComponent(itemId)}`),

  // current user (profile + KYC)
  getMe: () => req<UserJson>('/me'),
  updateMe: (body: UpdateProfileInput) => req<UserJson>('/me', { method: 'PUT', body: JSON.stringify(body) }),

  // owner store + items
  getMyStore: () => req<StoreJson>('/me/store'),
  upsertMyStore: (body: UpsertStoreInput) => req<StoreJson>('/me/store', { method: 'PUT', body: JSON.stringify(body) }),
  listMyItems: () => req<ItemJson[]>('/me/store/items'),
  createMyItem: (body: ItemInput) => req<ItemJson>('/me/store/items', { method: 'POST', body: JSON.stringify(body) }),
  updateMyItem: (itemId: string, body: ItemInput) =>
    req<ItemJson>(`/me/store/items/${encodeURIComponent(itemId)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // orders
  listMyOrders: () => req<OrderJson[]>('/me/orders'),
  listMyStoreOrders: () => req<OrderJson[]>('/me/store/orders'),
  getOrder: (orderId: string) => req<OrderJson>(`/orders/${encodeURIComponent(orderId)}`),
  /** Create an order + Stripe Checkout session; redirect the buyer to `url`. */
  createOrder: (body: { itemId: string; quantity?: number }) =>
    req<{ orderId: string; url: string }>('/orders', { method: 'POST', body: JSON.stringify(body) }),

  /** Upload a store or item image to R2; returns the `/api/flea-market/files/<key>` URL. */
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
