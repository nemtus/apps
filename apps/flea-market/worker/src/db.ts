import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

/** Drizzle client bound to the Worker's D1, aware of the full (auth + domain) schema. */
export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Db = ReturnType<typeof createDb>;
export { schema };
