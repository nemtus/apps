/**
 * react-firebase-hooks の `useAuthState(auth)` のドロップイン代替。Better Auth の
 * `useSession` を基にし、同じ `[user, loading, error]` タプルを返す。Better Auth の `user.id`
 * （元の Firebase uid を保持）を `.uid` にマップするので、多数の `authUser.uid` 参照はそのまま動く。
 */
import { useSession } from '../configs/auth';

export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  name: string;
}

export function useAuthUser(): [AuthUser | undefined, boolean, Error | undefined] {
  const { data, isPending, error } = useSession();
  if (isPending) return [undefined, true, undefined];
  const user: AuthUser | undefined = data?.user
    ? {
        uid: data.user.id,
        email: data.user.email,
        emailVerified: data.user.emailVerified,
        name: data.user.name,
      }
    : undefined;
  return [user, false, error ? new Error(error.message ?? '認証エラー') : undefined];
}
