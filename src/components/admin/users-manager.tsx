"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { updateUserRole, createAdminUser, deleteUser } from "@/app/admin/actions/content";
import type { ProfileRow } from "@/types/database";
import { Trash2 } from "lucide-react";

const ROLES = ["super_admin", "admin", "editor", "hr_manager", "content_manager"];

export function UsersManager({ profiles, currentUserId }: { profiles: ProfileRow[]; currentUserId: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ email: "", password: "", full_name: "", role: "editor" });
  const [message, setMessage] = useState("");

  function setRole(id: string, role: string) {
    startTransition(async () => {
      await updateUserRole({ id, role });
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm(t("deleteUser"))) return;
    startTransition(async () => {
      await deleteUser(id);
      router.refresh();
    });
  }

  function create(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createAdminUser(form);
      setMessage(res.ok ? t("userCreated") : res.error ?? "Failed");
      if (res.ok) setForm({ email: "", password: "", full_name: "", role: "editor" });
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-semibold text-charcoal-900">{t("createAdminUser")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">{t("fullName")}</label><input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></div>
          <div><label className="label">{t("email")}</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div><label className="label">{t("password")}</label><input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} /></div>
          <div>
            <label className="label">{t("role")}</label>
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <Button type="submit" loading={pending} className="mt-4">{t("createUser")}</Button>
        {message && <p className="mt-3 text-sm text-charcoal-600">{message}</p>}
      </form>

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("name")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("email")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("role")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {profiles.map((p) => (
              <tr key={p.id} className="hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{p.full_name || "—"}</td>
                <td className="px-4 py-3 text-charcoal-600">{p.email}</td>
                <td className="px-4 py-3">
                  {p.id === currentUserId ? (
                    <span className="text-sm text-charcoal-600">{p.role}</span>
                  ) : (
                    <select className="input !w-auto !py-1.5" value={p.role} onChange={(e) => setRole(p.id, e.target.value)} disabled={pending}>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  )}
                </td>
                <td className="px-4 py-3 text-end">
                  {p.id !== currentUserId && (
                    <button onClick={() => remove(p.id)} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" /> {t("delete")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
