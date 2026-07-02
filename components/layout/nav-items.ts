import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Workspace",
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === "/dashboard",
  },
  {
    href: "/audits",
    label: "Audits",
    shortLabel: "Audits",
    icon: ClipboardList,
    isActive: (pathname: string) =>
      pathname === "/audits" ||
      pathname === "/audits/new" ||
      (pathname.startsWith("/audits/") && !pathname.endsWith("/report")),
  },
  {
    href: "/reports",
    label: "Reports",
    icon: FileText,
    isActive: (pathname: string) =>
      pathname === "/reports" || pathname.endsWith("/report"),
  },
  {
    href: "/demo",
    label: "Demo-Kunde",
    shortLabel: "Demo",
    icon: Sparkles,
    isActive: (pathname: string) => pathname === "/demo",
  },
  {
    href: "/settings",
    label: "Einstellungen",
    shortLabel: "Optionen",
    icon: Settings,
    isActive: (pathname: string) => pathname === "/settings",
  },
] as const;
