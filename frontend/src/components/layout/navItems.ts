import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/dashboard/bookings", label: "My bookings", icon: BookOpen },
  { href: "/dashboard/settings", label: "Profile", icon: Settings },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/rooms");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
