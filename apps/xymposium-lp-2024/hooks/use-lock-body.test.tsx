import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useLockBody } from "./use-lock-body";

describe("useLockBody", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("マウント中は body の overflow を hidden にする", () => {
    renderHook(() => useLockBody());
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("アンマウント時に元の overflow へ戻す", () => {
    document.body.style.overflow = "scroll";
    const { unmount } = renderHook(() => useLockBody());
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });
});
