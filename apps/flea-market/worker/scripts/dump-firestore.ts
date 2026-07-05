/**
 * Stage 1 of the Firestore → D1 domain migration: dump flea-market's collections
 * to JSONL using the Firebase Admin SDK. Runs in an environment with Firestore
 * credentials; the pure transform (etl-domain.ts) turns the JSONL into D1 SQL.
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=./sa.json \
 *   node --experimental-strip-types scripts/dump-firestore.ts ./firestore-dump
 *
 * Firestore stores no createdAt/updatedAt fields, so we capture the document
 * createTime/updateTime metadata here. Each JSONL line is `{ id, ...metadata, ...docData }`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function main(): Promise<void> {
  const outDir = process.argv[2] ?? './firestore-dump';
  mkdirSync(outDir, { recursive: true });

  initializeApp({ credential: applicationDefault() });
  const db = getFirestore();

  const storeLines: string[] = [];
  const itemLines: string[] = [];
  const orderLines: string[] = [];
  const userLines: string[] = [];

  // Public store copies + their items (verbatim copies of the private docs).
  const stores = await db.collection('stores').get();
  for (const s of stores.docs) {
    storeLines.push(
      JSON.stringify({
        id: s.id,
        createdAt: s.createTime?.toMillis(),
        updatedAt: s.updateTime?.toMillis(),
        ...s.data(),
      }),
    );
    const items = await db.collection(`stores/${s.id}/items`).get();
    for (const it of items.docs) {
      itemLines.push(
        JSON.stringify({
          id: it.id,
          storeId: s.id,
          createdAt: it.createTime?.toMillis(),
          updatedAt: it.updateTime?.toMillis(),
          ...it.data(),
        }),
      );
    }
  }

  // Private user profile (users/{userId}) — buyer contact/shipping + legacy Symbol
  // address — and their orders (buyer view is the source of truth).
  const users = await db.collection('users').get();
  for (const u of users.docs) {
    userLines.push(
      JSON.stringify({
        id: u.id,
        createdAt: u.createTime?.toMillis(),
        updatedAt: u.updateTime?.toMillis(),
        ...u.data(),
      }),
    );
    const orders = await db.collection(`users/${u.id}/orders`).get();
    for (const o of orders.docs) {
      orderLines.push(
        JSON.stringify({
          id: o.id,
          buyerUserId: u.id,
          createdAt: o.createTime?.toMillis(),
          updatedAt: o.updateTime?.toMillis(),
          ...o.data(),
        }),
      );
    }
  }

  writeFileSync(`${outDir}/stores.jsonl`, `${storeLines.join('\n')}\n`);
  writeFileSync(`${outDir}/items.jsonl`, `${itemLines.join('\n')}\n`);
  writeFileSync(`${outDir}/orders.jsonl`, `${orderLines.join('\n')}\n`);
  writeFileSync(`${outDir}/users.jsonl`, `${userLines.join('\n')}\n`);
  console.error(
    `dumped ${storeLines.length} stores, ${itemLines.length} items, ${orderLines.length} orders, ${userLines.length} users → ${outDir}`,
  );
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
