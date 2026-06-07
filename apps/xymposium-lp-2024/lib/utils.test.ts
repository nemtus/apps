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

  it.each(["", "plainaddress", "a@b", "a@@b.com", "a b@c.com", "no-at-sign.com"])("無効なメール: %s", (email) => {
    expect(TextValidation.isEmail(email)).toBe(false);
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
