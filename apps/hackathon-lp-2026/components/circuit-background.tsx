"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const generateGridPaths = () => {
  const paths = []
  const gridSize = 8.3
  const width = 1400
  const height = 1800

  const centerX = width / 2
  const centerY = height / 2

  for (let offset = 0; offset < height / 2; offset += gridSize) {
    if (centerY - offset >= 0) {
      paths.push({
        type: "horizontal" as const,
        y: centerY - offset,
        delay: Math.random() * 10, // より長い遅延
        duration: 4 + Math.random() * 6, // より遅いスピード（4〜10秒）
        direction: Math.random() > 0.5 ? "forward" : "backward",
      })
    }
    if (offset > 0 && centerY + offset <= height) {
      paths.push({
        type: "horizontal" as const,
        y: centerY + offset,
        delay: Math.random() * 10,
        duration: 4 + Math.random() * 6,
        direction: Math.random() > 0.5 ? "forward" : "backward",
      })
    }
  }

  for (let offset = 0; offset < width / 2; offset += gridSize) {
    if (centerX - offset >= 0) {
      paths.push({
        type: "vertical" as const,
        x: centerX - offset,
        delay: Math.random() * 10,
        duration: 4 + Math.random() * 6,
        direction: Math.random() > 0.5 ? "forward" : "backward",
      })
    }
    if (offset > 0 && centerX + offset <= width) {
      paths.push({
        type: "vertical" as const,
        x: centerX + offset,
        delay: Math.random() * 10,
        duration: 4 + Math.random() * 6,
        direction: Math.random() > 0.5 ? "forward" : "backward",
      })
    }
  }

  return paths
}

export function CircuitBackground() {
  // Randomized paths are generated on the client only. Doing this at module scope
  // would run once at build (static export prerender) and again on hydration with
  // different Math.random() values, causing a hydration mismatch / flicker.
  const [gridPaths, setGridPaths] = useState<ReturnType<typeof generateGridPaths>>([])

  useEffect(() => {
    setGridPaths(generateGridPaths())
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1400 1800"
        preserveAspectRatio="xMidYMid slice"
      >
        {gridPaths.map((path, i) => (
          <g key={i}>
            {path.type === "horizontal" ? (
              <>
                <line
                  x1="0"
                  y1={path.y}
                  x2="1400"
                  y2={path.y}
                  stroke="#001a00"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <motion.line
                  y1={path.y}
                  y2={path.y}
                  stroke="#00cc00"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                  initial={
                    path.direction === "forward" ? { x1: -1, x2: 0 } : { x1: 1401, x2: 1400 }
                  }
                  animate={
                    path.direction === "forward" ? { x1: 1400, x2: 1401 } : { x1: 0, x2: -1 }
                  }
                  transition={{
                    duration: path.duration,
                    delay: path.delay,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "linear",
                  }}
                />
              </>
            ) : (
              <>
                <line
                  x1={path.x}
                  y1="0"
                  x2={path.x}
                  y2="1800"
                  stroke="#001a00"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <motion.line
                  x1={path.x}
                  x2={path.x}
                  stroke="#00cc00"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                  initial={
                    path.direction === "forward" ? { y1: -1, y2: 0 } : { y1: 1801, y2: 1800 }
                  }
                  animate={
                    path.direction === "forward" ? { y1: 1800, y2: 1801 } : { y1: 0, y2: -1 }
                  }
                  transition={{
                    duration: path.duration,
                    delay: path.delay,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "linear",
                  }}
                />
              </>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
