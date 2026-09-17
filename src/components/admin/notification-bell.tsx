"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bell, CheckCheck, X } from "lucide-react";
import { markNotificationRead, markAllNotificationsRead } from "@/app/admin/actions/content";
import { cn } from "@/lib/utils";

interface Notif {
  id: string;
  type: string;
  title_en: string;
  body_en: string | null;
  read: boolean;
  created_at: string;
}

export function NotificationBell({ initialUnread }: { initialUnread: number }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(initialUnread);
  const [pending, startTransition] = useTransition();

  async function load() {
    const res = await fetch("/api/admin/notifications").catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setItems(data.notifications ?? []);
      setUnread(data.unread ?? 0);
    }
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  function markRead(id: string) {
    startTransition(async () => {
      await markNotificationRead(id);
      await load();
      router.refresh();
    });
  }

  function markAll() {
    startTransition(async () => {
      await markAllNotificationsRead();
      await load();
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-charcoal-600 hover:bg-charcoal-50"
        aria-label={t("notifications")}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-charcoal-100 px-4 py-3">
            <p className="text-sm font-semibold text-charcoal-900">{t("notifications")}</p>
            {unread > 0 && (
              <button type="button" onClick={markAll} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
                <CheckCheck className="h-3.5 w-3.5" /> {t("markAllRead")}
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-charcoal-400">{t("noNotifications")}</li>
            ) : (
              items.map((n) => (
                <li key={n.id} className={cn("border-b border-charcoal-50 px-4 py-3", !n.read && "bg-brand-50/40")}>
                  <div className="flex items-start gap-2">
                    <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-charcoal-200" : "bg-brand-500")} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-charcoal-900">{n.title_en}</p>
                      <p className="truncate text-xs text-charcoal-500">{n.body_en}</p>
                      <p className="mt-0.5 text-[11px] text-charcoal-400">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    {!n.read && (
                      <button type="button" onClick={() => markRead(n.id)} className="rounded p-1 text-charcoal-400 hover:bg-charcoal-50" aria-label={t("markRead")}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
