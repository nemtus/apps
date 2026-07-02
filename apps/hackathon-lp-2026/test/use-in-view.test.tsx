import { render, act } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useInView } from "@/hooks/use-in-view"

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void

let lastOptions: IntersectionObserverInit | undefined
let lastCallback: IOCallback | undefined

class MockIntersectionObserver {
  constructor(cb: IOCallback, options?: IntersectionObserverInit) {
    lastCallback = cb
    lastOptions = options
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

function Probe({ amount }: { amount?: number }) {
  const { ref, isInView } = useInView<HTMLDivElement>(amount != null ? { amount } : undefined)
  return <div ref={ref} data-testid="probe" data-inview={String(isInView)} />
}

describe("useInView", () => {
  beforeEach(() => {
    lastOptions = undefined
    lastCallback = undefined
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("maps the `amount` option to the IntersectionObserver threshold", () => {
    render(<Probe amount={0.5} />)
    expect(lastOptions?.threshold).toBe(0.5)
  })

  it("latches isInView to true once the element intersects", () => {
    const { getByTestId } = render(<Probe />)
    expect(getByTestId("probe").getAttribute("data-inview")).toBe("false")

    act(() => {
      lastCallback?.([{ isIntersecting: true }])
    })

    expect(getByTestId("probe").getAttribute("data-inview")).toBe("true")
  })
})
