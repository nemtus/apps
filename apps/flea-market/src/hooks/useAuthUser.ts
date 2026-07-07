/**
 * Drop-in replacement for react-firebase-hooks' `useAuthState(auth)`, backed by
 * Better Auth's `useSession`. Returns the same `[user, loading, error]` tuple, and
 * maps the Better Auth `user.id` (which preserves the original Firebase uid) to
 * `.uid` so the many `authUser.uid` call sites keep working unchanged.
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
  return [user, false, error ? new Error(error.message ?? 'authentication error') : undefined];
}
