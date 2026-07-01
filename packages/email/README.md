# @nemtus/email

Transactional email for Cloudflare Workers via **AWS SES v2**, SigV4-signed with
`aws4fetch` (no AWS SDK, no Node APIs).

```ts
import { createSesSender } from '@nemtus/email';

const email = createSesSender({
  region: 'ap-northeast-1',
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  defaultFrom: 'NEMTUS <no-reply@nemtus.com>',
});

await email.send({ to: 'user@example.com', subject: '…', text: '…' });
```

Injected into `@nemtus/auth` for verification / password-reset emails. Requires a
verified SES identity (domain or address) and SES out of sandbox for production
sending. Store credentials as Workers secrets; prefer a scoped IAM user or role
limited to `ses:SendEmail`.
