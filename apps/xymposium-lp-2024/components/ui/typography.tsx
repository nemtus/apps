import { cn } from "@/lib/utils";
import * as React from "react";

const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "text-3xl font-extrabold tracking-tight sm:text-6xl md:text-7xl py-3",
      className
    )}
    {...props}
  />
));
H1.displayName = "H1";

const H2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-2xl font-semibold tracking-tight sm:text-5xl md:text-6xl py-3",
      className
    )}
    {...props}
  />
));
H2.displayName = "H2";

const H3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold tracking-tight sm:text-4xl md:text-5xl py-2",
      className
    )}
    {...props}
  />
));
H3.displayName = "H3";

const Paragraph = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base font-normal leading-normal", className)}
    {...props}
  />
));
Paragraph.displayName = "Paragraph";

export { H1, H2, H3, Paragraph };
