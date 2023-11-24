"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { useInView } from "react-intersection-observer";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  threshold?: number;
}

export default function InViewFadeIn(props: Props): JSX.Element {
  const { ref, inView } = useInView({ threshold: props.threshold ?? 0.4, triggerOnce: true });
  const [animationClass, setAnimationClass] = React.useState<string>("");

  React.useEffect(() => {
    let mounted = true;
    if (mounted && !animationClass && inView) {
      setAnimationClass("animate-slide-in");
    }
    return () => {
      mounted = false;
    };
  }, [inView, animationClass]);

  return (
    <div {...props} ref={ref} className={cn(props.className, animationClass ? animationClass : "opacity-0")}>
      {props.children}
    </div>
  );
}
