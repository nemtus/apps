import { cn } from "@/lib/utils";
import * as React from "react";

const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("py-4 text-3xl font-extrabold tracking-tight sm:text-6xl md:text-6xl", className)}
      {...props}
    />
  ),
);
H1.displayName = "H1";

const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("py-8 text-2xl font-semibold tracking-tight sm:text-5xl md:text-6xl", className)}
      {...props}
    />
  ),
);
H2.displayName = "H2";

const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("py-2 text-xl font-semibold tracking-tight sm:text-4xl md:text-5xl", className)}
      {...props}
    />
  ),
);
H3.displayName = "H3";

const Paragraph = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-base leading-normal font-normal", className)} {...props} />
  ),
);
Paragraph.displayName = "Paragraph";

export { H1, H2, H3, Paragraph };
