/**
 * Better Auth のブラウザクライアント — Firebase Auth を置き換える。flea-market Worker の
 * 共有コア `/api/auth/*` と通信する（NEMTUS の全アプリで1アカウント）。セッション Cookie は
 * クロスサブドメイン（`.nemtus.com`）なので、どの NEMTUS アプリでログインしても `useSession()`
 * に反映される。KYC/プロフィールはセッションに無いため `api.getMe()` で取得する（configs/api.ts 参照）。
 */
/* eslint-disable import/no-unresolved -- better-auth のパッケージ "exports" サブパスをリゾルバが辿れない（tsc は解決可能） */
import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';
/* eslint-enable import/no-unresolved */

// baseURL は Worker のオリジン。クライアントが `/api/auth/*` を付加する。undefined なら SPA と
// 同一オリジン。SPA を別オリジンで配信する場合は REACT_APP_API_BASE_URL を設定する。
const baseURL = (import.meta.env.REACT_APP_API_BASE_URL as string | undefined) || undefined;

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
  changePassword,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
} = authClient;
