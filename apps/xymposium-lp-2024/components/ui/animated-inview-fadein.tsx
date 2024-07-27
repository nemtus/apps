"use client";
import React, { useRef } from "react";
import { useInView, motion, HTMLMotionProps } from "framer-motion";

interface Props extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

/**
 * 画面に表示された際にフェードインするアニメーション
 */
export default function AnimatedInViewFadeIn(props: Props): JSX.Element {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 100px -100px 0px" });

  return (
    <motion.div
      {...props}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.9,
        ease: [0.17, 0.55, 0.55, 1],
        delay: 0.5,
      }}
    >
      <>{props.children}</>
    </motion.div>
  );
}
