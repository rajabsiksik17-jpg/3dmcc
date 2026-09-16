"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/actions/auth";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GraduationCap,
  Users,
  HelpCircle,
  Layers,
  Inbox,
  Bell,
  Building2,
  Search,
  Plug,
  ShieldCheck,
  Image,
  Menu,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: typeof FileText;
  badge?: number;
  superOnly?: boolean;
  group?: string;
}

export function AdminShell({
  children,
  unread,
  role,
  fullName,
}: {
  children: React.ReactNode;
  unread: number;
  role: string;
  fullName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Pages", href: "/admin/pages", icon: FileText, group: "Content" },
    { label: "Services", href: "/admin/services", icon: Briefcase },
    { label: "Courses", href: "/admin/courses", icon: GraduationCap },
    { label: "Careers", href: "/admin/careers", icon: Users },
    { label: "Team", href: "/admin/team", icon: Users },
    { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    { label: "Media", href: "/admin/media", icon: Image },
    { label: "Forms", href: "/admin/forms", icon: Layers, group: "Forms" },
    { label: "Submissions", href: "/admin/submissions", icon: Inbox, badge: unread },
    { label: "Notifications", href: "/admin/notifications", icon: Bell, badge: unread },
    { label: "Company Info", href: "/admin/company", icon: Building2, group: "Company" },
    { label: "SEO", href: "/admin/seo", icon: Search },
    { label: "Integrations", href: "/admin/integrations", icon: Plug },
    { label: "Users & Roles", href: "/admin/users", icon: ShieldCheck, superOnly: true },
  ];

  const visibleNav = nav.filter((i) => !i.superOnly || role === "super_admin");

  function SidebarContent() {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2.5 border-b border-charcoal-800 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-sm font-bold text-white">
            3D
          </span>
          <div>
            <p className="text-sm font-bold text-white">3DMCC</p>
            <p className="text-[11px] text-charcoal-400">Admin Dashboard</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {visibleNav.map((item) => (
            <div key={item.href}>
              {item.group && (
                <p className="mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-charcoal-500 first:mt-0">
                  {item.group}
                </p>
              )}
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "mt-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  (pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href)))
                    ? "bg-brand-500/15 text-brand-300"
                    : "text-charcoal-300 hover:bg-charcoal-800 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            </div>
          ))}
        </nav>
        <div className="border-t border-charcoal-800 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-700 text-xs font-bold text-white">
              {fullName?.charAt(0) ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{fullName || "Admin"}</p>
              <p className="truncate text-[11px] text-charcoal-400">{role}</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-charcoal-400 hover:bg-charcoal-800 hover:text-white"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 bg-charcoal-950 lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-64 bg-charcoal-950">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="lg:ps-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-charcoal-100 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-charcoal-700 hover:bg-charcoal-50 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-semibold text-charcoal-900">
              {nav.find((n) => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label ??
                "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-charcoal-600 hover:bg-charcoal-50"
            >
              View Website
            </Link>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
