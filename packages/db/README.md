# @nemtus/db

Drizzle ORM schema + Cloudflare D1 client for `nemtus/apps`.

- `schema` — Better Auth core tables (`user`, `session`, `account`, `verification`)
  plus the `admin` plugin columns and the KYC `additionalFields`
  (`userKycVerified`, `storeKycVerified`, `storeEmailVerified`,
  `storePhoneNumberVerified`, `storeAddressVerified`). D1 is SQLite.
- `createDb(env.DB)` — a Drizzle client bound to a Workers D1 binding.

```ts
import { createDb, schema } from '@nemtus/db';
const db = createDb(env.DB);
const rows = await db.select().from(schema.user);
```

## Migrations

```bash
npm run db:generate     # drizzle-kit → ./migrations/*.sql
# then, from the consuming app (which owns the D1 binding):
wrangler d1 migrations apply <BINDING> --local     # or --remote
```

App-specific domain tables (Firestore → D1 ETL targets: entries/votes/orders/…)
are added per app in later phases; keep the shared auth schema here.

Regenerate/verify the auth tables against the live Better Auth config with
`npx @better-auth/cli generate`.
