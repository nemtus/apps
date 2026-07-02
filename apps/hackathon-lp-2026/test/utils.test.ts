import { describe, expect, it } from "vitest"
import { cn } from "@/lib/utils"

describe("cn()", () => {
  it("joins truthy class names and drops falsy ones", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c")
  })

  it("dedupes conflicting tailwind utilities (last one wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
    expect(cn("text-sm", "text-lg")).toBe("text-lg")
  })

  it("keeps non-conflicting utilities", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4")
  })
})
