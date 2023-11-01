import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import NextLink from "next/link";
import * as React from "react";

const linkVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        button: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        default: "text-base",
        button: "h-10 px-4 py-2",
        buttonSm: "h-9 rounded-md px-3",
        buttonLg: "h-11 rounded-md px-8",
        buttonIcon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
  asChild?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <NextLink className={cn(linkVariants({ variant, size, className }))} ref={ref} href={href ?? "#"} {...props} />
    );
  }
);
Link.displayName = "Link";

export { Link, linkVariants };
