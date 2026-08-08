"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { NAV_ITEMS, isNavItemActive } from "./navItems";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[68px] shrink-0 flex-col items-center gap-2 border-r border-border bg-sidebar py-3 md:flex">
      <Link
        href="/dashboard"
        className="mb-2 flex size-11 items-center justify-center"
        aria-label="Dashboard"
      >
        <Logo size={32} />
      </Link>

      <nav className="flex flex-col items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className="flex size-11 items-center justify-center"
            >
              <span
                className={
                  "flex size-[34px] items-center justify-center rounded-[8px] transition-colors " +
                  (active
                    ? "bg-card text-heading shadow-widget"
                    : "text-muted hover:bg-card/60 hover:text-heading")
                }
              >
                <Icon size={18} aria-hidden />
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
