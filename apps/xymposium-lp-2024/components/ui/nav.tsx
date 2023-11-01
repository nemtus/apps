"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import * as React from "react";

import SymbolLogoLight from "@/assets/symbol-logo-with-text-light.png";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { MobileNav } from "@/components/ui/nav-mobile";
import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";
import Image from "next/image";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  const handleToggleMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="flex grow items-center">
      <div className="flex grow gap-6 md:gap-10">
        <Link href="/" className="items-center space-x-2 md:flex">
          <Image loading="eager" alt="symbol-logo-wide" src={SymbolLogoLight} height={30} />
        </Link>
        {items?.length ? (
          <nav className="hidden gap-6 md:flex">
            {items?.map((item, index) => (
              <Link
                key={index}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                  item.href.startsWith(`/${segment}`) ? "text-foreground" : "text-foreground/60",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
      <div>
        <Button variant={"ghost"} className="flex items-center space-x-2 md:hidden " onClick={handleToggleMenu}>
          {showMobileMenu ?? <Icons.close />}
          <Icons.menu className="h-6 w-6" />
        </Button>
      </div>
      {showMobileMenu && items && <MobileNav items={items}>{children}</MobileNav>}
    </div>
  );
}
