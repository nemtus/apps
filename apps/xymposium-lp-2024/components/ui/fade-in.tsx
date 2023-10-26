"use client";
import { useInView } from "react-intersection-observer";

interface Props {
  children: React.ReactNode;
}

export function FadeIn(props: Props): JSX.Element {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  return <div ref={ref}>{props.children}</div>;
}
