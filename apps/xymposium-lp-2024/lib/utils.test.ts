import { describe, expect, it } from "vitest";
import { cn, TextValidation } from "./utils";

describe("cn", () => {
  it("複数のクラスを結合する", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("falsy な値は無視する", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("条件付きクラス (オブジェクト記法) を解決する", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("競合する Tailwind ユーティリティは後勝ちでマージする", () => {
    expect(cn("px-2 px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });
});

describe("TextValidation.isEmail", () => {
  it.each(["a@b.com", "user.name@example.co.jp", "x+tag@sub.domain.io"])("有効なメール: %s", (email) => {
    expect(TextValidation.isEmail(email)).toBe(true);
  });

  it.each([
    "",
    "plainaddress",
    "a@b",
    "a@@b.com",
    "a b@c.com",
    "no-at-sign.com",
    // 区切りドットが曖昧でない (= 連続/先頭/末尾ドットは無効) ことを固定する境界ケース。
    "a@b..c",
    "a@b.c.",
    "a@.b",
  ])("無効なメール: %s", (email) => {
    expect(TextValidation.isEmail(email)).toBe(false);
  });

  // ReDoS (js/polynomial-redos) ガード。脆弱な正規表現では入力長の2乗で
  // バックトラッキングが爆発するため、攻撃文字列でしきい値を超過する。
  // 線形な正規表現なら数ミリ秒で完了するので、十分なマージンを持つしきい値で検出する。
  it("ReDoS 攻撃文字列でも即座に判定を返す", { timeout: 30_000 }, () => {
    // 末尾の空白で「ほぼマッチするが最後に失敗」する形にし、曖昧な区切りドットの
    // バックトラッキングを最大化する (脆弱な正規表現では入力長の2乗で増大する)。
    const evil = "a@" + "a.".repeat(50_000) + " ";
    const start = performance.now();
    const result = TextValidation.isEmail(evil);
    const elapsedMs = performance.now() - start;

    expect(result).toBe(false);
    expect(elapsedMs).toBeLessThan(1_000);
  });
});

describe("TextValidation.isSymbol", () => {
  it("記号を含まない文字列は true", () => {
    expect(TextValidation.isSymbol("NABCDE123")).toBe(true);
    expect(TextValidation.isSymbol("Taro")).toBe(true);
  });

  it("記号を含む文字列は false", () => {
    expect(TextValidation.isSymbol("a@b")).toBe(false);
    expect(TextValidation.isSymbol("hello!")).toBe(false);
    expect(TextValidation.isSymbol("a-b-c")).toBe(false);
  });
});
