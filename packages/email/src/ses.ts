/**
 * AWS SES v2 sender for Cloudflare Workers. Requests are SigV4-signed with
 * aws4fetch (no AWS SDK, no Node APIs). Uses the SES v2 SendEmail JSON API:
 *   POST https://email.<region>.amazonaws.com/v2/email/outbound-emails
 */
import { AwsClient } from 'aws4fetch';
import type { EmailMessage, EmailSender } from './types';

export interface SesConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** default From (must be a verified SES identity) */
  defaultFrom: string;
  /** optional configuration set for tracking/suppression */
  configurationSetName?: string;
}

export function createSesSender(config: SesConfig): EmailSender {
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
    service: 'ses', // SES SigV4 service name (host is email.<region>.amazonaws.com)
  });
  const endpoint = `https://email.${config.region}.amazonaws.com/v2/email/outbound-emails`;

  return {
    async send(msg: EmailMessage): Promise<void> {
      const body: Record<string, unknown> = {
        FromEmailAddress: msg.from ?? config.defaultFrom,
        Destination: { ToAddresses: [msg.to] },
        Content: {
          Simple: {
            Subject: { Data: msg.subject, Charset: 'UTF-8' },
            Body: {
              ...(msg.text ? { Text: { Data: msg.text, Charset: 'UTF-8' } } : {}),
              ...(msg.html ? { Html: { Data: msg.html, Charset: 'UTF-8' } } : {}),
            },
          },
        },
      };
      if (config.configurationSetName) body.ConfigurationSetName = config.configurationSetName;

      const res = await client.fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`SES send failed (${res.status}): ${detail}`);
      }
    },
  };
}
