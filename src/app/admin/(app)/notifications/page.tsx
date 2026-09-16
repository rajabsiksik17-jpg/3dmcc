import { requireAdmin } from "@/lib/auth";
import { adminNotifications } from "@/lib/admin-data";
import { markAllNotificationsRead, deleteNotification, markNotificationRead } from "@/app/admin/actions/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { Bell, CheckCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  await requireAdmin();
  const notifications = await adminNotifications();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal-900">Notifications</h1>
        <form action={markAllNotificationsRead}>
          <button type="submit" className="btn-secondary !py-2">
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </button>
        </form>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-charcoal-100 bg-white py-16 text-center shadow-card">
          <Bell className="mx-auto h-10 w-10 text-charcoal-300" />
          <p className="mt-3 text-sm text-charcoal-500">No notifications.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-card ${
                n.read ? "border-charcoal-100" : "border-brand-200"
              }`}
            >
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? "bg-charcoal-200" : "bg-brand-500"}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-charcoal-900">{n.title_en}</p>
                <p className="mt-0.5 truncate text-sm text-charcoal-500">{n.body_en}</p>
                <p className="mt-1 text-xs text-charcoal-400">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                {!n.read && (
                  <form action={markNotificationRead.bind(null, n.id)}>
                    <button type="submit" className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">
                      Mark read
                    </button>
                  </form>
                )}
                <DeleteButton action={deleteNotification.bind(null, n.id)} confirmText="Delete this notification?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
