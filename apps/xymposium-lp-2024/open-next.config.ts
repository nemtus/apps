import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// このアプリは ISR / on-demand revalidation を使わないため
// incrementalCache などのオーバーライドは未設定 (デフォルト) のままにしている。
// 将来 ISR を使う場合は r2IncrementalCache 等をここで設定する。
export default defineCloudflareConfig({});
