/**
 * Copy Firebase Storage objects → Cloudflare R2, preserving keys, so the migrated
 * D1 image references (rewritten to /api/files/<key> by etl-domain.ts) resolve.
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=./sa.json \
 *   FIREBASE_STORAGE_BUCKET=symbol-fest-market.appspot.com \
 *   R2_ACCOUNT_ID=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=... R2_BUCKET=flea-market \
 *   node --experimental-strip-types scripts/copy-storage.ts
 *
 * Streams each object through memory (fine for images). Uses R2's S3-compatible
 * API signed with aws4fetch — no AWS SDK.
 */
import { AwsClient } from 'aws4fetch';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`missing env ${name}`);
    process.exit(1);
  }
  return v;
}

async function main(): Promise<void> {
  const accountId = requireEnv('R2_ACCOUNT_ID');
  const r2Bucket = requireEnv('R2_BUCKET');
  const client = new AwsClient({
    accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
    secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    service: 's3',
    region: 'auto',
  });
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${r2Bucket}`;

  initializeApp({
    credential: applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
  const bucket = getStorage().bucket();

  const [files] = await bucket.getFiles();
  let copied = 0;
  let failed = 0;
  for (const file of files) {
    const key = file.name;
    if (key.endsWith('/')) continue; // skip folder placeholders
    try {
      const [buf] = await file.download();
      const res = await client.fetch(`${endpoint}/${key.split('/').map(encodeURIComponent).join('/')}`, {
        method: 'PUT',
        body: buf,
        headers: {
          'content-type': file.metadata.contentType ?? 'application/octet-stream',
        },
      });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      copied += 1;
    } catch (e) {
      failed += 1;
      console.error(`FAILED ${key}: ${(e as Error).message}`);
    }
  }
  console.error(`copied ${copied} objects to r2://${r2Bucket}${failed ? `, ${failed} failed` : ''}`);
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
