import { cn } from "@/lib/utils";
import React from "react";

interface Props extends React.BaseHTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/**
 * レスポンシブ等で文字の折り返し範囲を指定する為のテキストブロック
 */
export default function TextSpan(props: Props): React.JSX.Element {
  return (
    <span {...props} className={cn("inline-block", props.className)}>
      {props.children}
    </span>
  );
}
