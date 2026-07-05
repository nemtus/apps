/**
 * User ETL: transform a `firebase auth:export` JSON dump into D1 SQL for the
 * Better Auth `user` / `account` tables (@nemtus/db schema).
 *
 *   firebase auth:export users.json --project symbol-fest-market
 *   node --experimental-strip-types scripts/etl-users.ts users.json > users.sql
 *   wrangler d1 execute flea-market --file=users.sql --remote
 *
 * Key decisions (see the migration plan):
 *  - Firebase uid is preserved as `user.id` so Firestore/Storage/Symbol refs stay valid.
 *  - Credential users get an `account` row whose password is a Firebase-scrypt marker
 *    (`firebase-scrypt$<hash>$<salt>`) that @nemtus/auth verifies and lazily re-hashes.
 *  - Each federated identity becomes one `account` row (provider mapped to Better Auth ids).
 *  - Custom claims map to the admin role (shared `user` table) + the flea-market KYC
 *    flags (relocated to `flea_market_user_profile`).
 *
 * The password marker prefix must match @nemtus/auth's FIREBASE_MARKER.
 */
import { readFileSync } from 'node:fs';

const FIREBASE_MARKER = 'firebase-scrypt';

const PROVIDER_MAP: Record<string, string> = {
  'google.com': 'google',
  'github.com': 'github',
  'twitter.com': 'twitter',
  'microsoft.com': 'microsoft',
  'apple.com': 'apple',
  'facebook.com': 'facebook',
  'yahoo.com': 'yahoo',
};

interface ProviderUserInfo {
  providerId: string;
  rawId: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
}

interface FirebaseUser {
  localId: string;
  email?: string;
  emailVerified?: boolean;
  passwordHash?: string;
  salt?: string;
  displayName?: string;
  photoUrl?: string;
  providerUserInfo?: ProviderUserInfo[];
  customAttributes?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthExport {
  users: FirebaseUser[];
}

function sqlStr(v: string | undefined | null): string {
  return v == null ? 'NULL' : `'${v.replace(/'/g, "''")}'`;
}

function sqlBool(v: unknown): string {
  return v ? '1' : '0';
}

function toSeconds(ms: string | undefined): number {
  const n = ms ? Number(ms) : NaN;
  return Number.isFinite(n) ? Math.floor(n / 1000) : Math.floor(Date.now() / 1000);
}

function main(): void {
  const path = process.argv[2];
  if (!path) {
    console.error('usage: etl-users <firebase-auth-export.json>  > users.sql');
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(path, 'utf8')) as AuthExport;
  const out: string[] = ['PRAGMA foreign_keys=OFF;'];

  for (const u of data.users) {
    const attrs = (u.customAttributes ? JSON.parse(u.customAttributes) : {}) as Record<string, unknown>;
    const created = toSeconds(u.createdAt);
    const updated = toSeconds(u.lastLoginAt ?? u.createdAt);
    const name = u.displayName ?? u.email ?? u.localId;
    const role = attrs.admin ? 'admin' : null;

    // Core identity → the shared `user` table (app-agnostic).
    out.push(
      'INSERT OR IGNORE INTO user ' +
        '(id,name,email,email_verified,image,created_at,updated_at,role) VALUES (' +
        `${sqlStr(u.localId)},${sqlStr(name)},${sqlStr(u.email)},${sqlBool(u.emailVerified)},` +
        `${sqlStr(u.photoUrl)},${created},${updated},${sqlStr(role)});`,
    );

    // flea-market KYC flags (from Firebase custom claims) → the app's profile table.
    // Buyer contact fields (phone/address) are backfilled by the domain ETL.
    out.push(
      'INSERT OR IGNORE INTO flea_market_user_profile ' +
        '(user_id,user_kyc_verified,store_kyc_verified,store_email_verified,' +
        'store_phone_number_verified,store_address_verified,created_at,updated_at) VALUES (' +
        `${sqlStr(u.localId)},${sqlBool(attrs.userKycVerified)},${sqlBool(attrs.storeKycVerified)},` +
        `${sqlBool(attrs.storeEmailVerified)},${sqlBool(attrs.storePhoneNumberVerified)},` +
        `${sqlBool(attrs.storeAddressVerified)},${created},${updated});`,
    );

    if (u.passwordHash && u.salt) {
      const marker = `${FIREBASE_MARKER}$${u.passwordHash}$${u.salt}`;
      out.push(
        'INSERT OR IGNORE INTO account ' +
          '(id,account_id,provider_id,user_id,password,created_at,updated_at) VALUES (' +
          `${sqlStr(`${u.localId}:credential`)},${sqlStr(u.localId)},'credential',` +
          `${sqlStr(u.localId)},${sqlStr(marker)},${created},${updated});`,
      );
    }

    for (const p of u.providerUserInfo ?? []) {
      const provider = PROVIDER_MAP[p.providerId];
      if (!provider) continue; // skip 'password' (handled above) and unknown providers
      out.push(
        'INSERT OR IGNORE INTO account ' +
          '(id,account_id,provider_id,user_id,created_at,updated_at) VALUES (' +
          `${sqlStr(`${u.localId}:${provider}`)},${sqlStr(p.rawId)},${sqlStr(provider)},` +
          `${sqlStr(u.localId)},${created},${updated});`,
      );
    }
  }

  out.push('PRAGMA foreign_keys=ON;');
  process.stdout.write(`${out.join('\n')}\n`);
  console.error(`-- ${data.users.length} users transformed`);
}

main();
