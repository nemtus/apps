import Link from "next/link";

import { useLockBody } from "@/hooks/use-lock-body";
import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";

interface MobileNavProps {
  items: MainNavItem[];
  onClose?: () => void;
}

export function MobileNav({ items, onClose }: MobileNavProps) {
  useLockBody();

  return (
    <div
      className={cn(
        "fixed inset-0 top-20 z-50 grid h-svh grid-flow-row auto-rows-max",
        "overflow-auto p-6 shadow-md animate-in slide-in-from-bottom md:hidden",
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              onClick={onClose}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                item.disabled && "cursor-not-allowed opacity-60",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      {/* クリックでメニューを閉じる半透明バックドロップ。
          元は bg-black + bg-opacity-80 (80% 黒) だが、Tailwind v4 で bg-opacity-* が
          無効化され bg-black が不透明黒になっていた。v4 の bg-black/80 で元の意図を再現する。 */}
      <div className="fixed left-0 z-10 h-screen w-screen bg-black/80" onClick={onClose} />
    </div>
  );
}
