/**
 * Transactional email templates (subject + plain text + HTML). Keeping the copy
 * here — instead of inlined at each call site (e.g. inside @nemtus/auth) — means
 * the wording lives in one place and can be tested. Copy is Japanese to match the
 * flea-market / hackathon apps' UI language.
 */

export interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Minimal, inline-styled HTML wrapper (email clients ignore <style>/external CSS). */
function layout(lines: string[]): string {
  const body = lines.map((l) => `<p style="margin:0 0 12px">${l}</p>`).join('');
  return `<div style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#111">${body}</div>`;
}

function linkButton(url: string): string {
  const safe = escapeHtml(url);
  return `<a href="${safe}" style="color:#2563eb;word-break:break-all">${safe}</a>`;
}

/** Email-address verification link. */
export function verificationEmail(url: string): EmailContent {
  return {
    subject: 'メールアドレスの確認',
    text: `メールアドレスを確認するには次のリンクを開いてください:\n${url}`,
    html: layout(['メールアドレスを確認するには次のリンクを開いてください:', linkButton(url)]),
  };
}

/** Password-reset link. */
export function passwordResetEmail(url: string): EmailContent {
  return {
    subject: 'パスワードの再設定',
    text: `パスワードを再設定するには次のリンクを開いてください:\n${url}`,
    html: layout(['パスワードを再設定するには次のリンクを開いてください:', linkButton(url)]),
  };
}

/** Order receipt after a successful payment. `amountJpy` is in yen (zero-decimal). */
export function orderReceiptEmail(args: {
  itemName: string;
  amountJpy: number;
  orderId: string;
}): EmailContent {
  const amount = `¥${args.amountJpy.toLocaleString('ja-JP')}`;
  return {
    subject: 'ご注文ありがとうございます',
    text: `ご注文を受け付けました。\n商品: ${args.itemName}\n金額: ${amount}\n注文番号: ${args.orderId}`,
    html: layout([
      'ご注文を受け付けました。',
      `商品: ${escapeHtml(args.itemName)}`,
      `金額: ${amount}`,
      `注文番号: ${escapeHtml(args.orderId)}`,
    ]),
  };
}
