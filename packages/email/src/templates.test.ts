import { describe, expect, it } from 'vitest';
import { orderReceiptEmail, passwordResetEmail, verificationEmail } from './templates';

describe('email templates', () => {
  it('verification email carries the link in both text and html', () => {
    const url = 'https://app.example/verify?token=abc123';
    const m = verificationEmail(url);
    expect(m.subject).toBe('メールアドレスの確認');
    expect(m.text).toContain(url);
    expect(m.html).toContain(`href="${url}"`);
  });

  it('password reset email carries the link', () => {
    const m = passwordResetEmail('https://app.example/reset?token=xyz');
    expect(m.subject).toBe('パスワードの再設定');
    expect(m.text).toContain('https://app.example/reset?token=xyz');
  });

  it('escapes HTML-significant characters in the url to prevent injection', () => {
    const m = verificationEmail('https://x/verify?a=1&b="2"><script>');
    expect(m.html).not.toContain('<script>');
    expect(m.html).toContain('&amp;');
    expect(m.html).toContain('&lt;script&gt;');
    // plain-text stays literal
    expect(m.text).toContain('<script>');
  });

  it('order receipt formats the amount as JPY', () => {
    const m = orderReceiptEmail({ itemName: 'Tシャツ', amountJpy: 12000, orderId: 'ord_9' });
    expect(m.text).toContain('¥12,000');
    expect(m.text).toContain('ord_9');
    expect(m.html).toContain('Tシャツ');
  });
});
