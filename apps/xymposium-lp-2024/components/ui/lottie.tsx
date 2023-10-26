"use client";
import LottieReact from "lottie-react";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  animationData: unknown;
  children?: never;
}

export function Lottie(props: Props): JSX.Element {
  return (
    <LottieReact
      className={props.className}
      animationData={props.animationData}
      style={props.style}
    />
  );
}
