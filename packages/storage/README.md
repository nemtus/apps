# @nemtus/storage

Cloudflare R2 helpers (over a Workers R2 binding) replacing Firebase Storage.

```ts
import { serveObject, assertOwner, putObject } from '@nemtus/storage';

// in a Worker route, after resolving the Better Auth session:
assertOwner(key, session.user.id);
return serveObject(env.BUCKET, key);
```

Object keys keep the Firebase Storage path convention (`users/<userId>/...`) so
they remain valid after the uid-preserving ETL. Firebase Storage security rules
become the `assertOwner`/`isOwnedBy` checks here. For presigned URLs (direct
browser upload/download) use R2's S3-compatible endpoint with `aws4fetch` — added
per app when needed.
