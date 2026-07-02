"use client"

import { useEffect, useRef, useState } from "react"

export interface UseInViewOptions {
  /** Fraction of the element that must be visible to count as "in view" (maps to IntersectionObserver `threshold`). */
  amount?: number
  root?: Element | null
  rootMargin?: string
  /** When false, `isInView` toggles back to false on exit. Defaults to true (latches once entered). */
  once?: boolean
}

export function useInView<T extends Element = HTMLElement>(options?: UseInViewOptions) {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        } else if (options?.once === false) {
          setIsInView(false)
        }
      },
      {
        threshold: options?.amount,
        root: options?.root ?? null,
        rootMargin: options?.rootMargin,
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options?.amount, options?.root, options?.rootMargin, options?.once])

  return { ref, isInView }
}
