"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { saveRole, deleteRole } from "@/app/admin/actions/content";
import type { RoleRow } from "@/types/database";
import { Trash2, Pencil, Plus, X } from "lucide-react";

const PERMISSION_GROUPS: { group: string; perms: string[] }[] = [
  { group: "Pages", perms: ["pages.view", "pages.create", "pages.update", "pages.delete"] },
  { group: "Services", perms: ["services.view", "services.create", "services.update", "services.delete"] },
  { group: "Courses", perms: ["courses.view", "courses.create", "courses.update", "courses.delete"] },
  { group: "Careers", perms: ["jobs.view", "jobs.create", "jobs.update", "jobs.delete"] },
  { group: "Applications", perms: ["applications.view", "applications.update"] },
  { group: "Forms", perms: ["forms.view", "forms.update"] },
  { group: "Media", perms: ["media.view", "media.manage"] },
  { group: "Other", perms: ["team.manage", "notifications.manage", "settings.manage"] },
];

const ALL_PERMS = PERMISSION_GROUPS.flatMap((g) => g.perms);

export function RolesManager({ roles }: { roles: RoleRow[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<RoleRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  function beginCreate() {
    setCreating(true);
    setEditing(null);
    setName("");
    setSelected([]);
  }

  function beginEdit(role: RoleRow) {
    setEditing(role);
    setCreating(false);
    setName(role.name);
    setSelected(Array.isArray(role.permissions) ? (role.permissions as unknown as string[]) : []);
  }

  function close() {
    setCreating(false);
    setEditing(null);
  }

  function toggle(perm: string) {
    setSelected((prev) => (prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]));
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveRole({ id: editing?.id, name, permissions: selected });
      router.refresh();
      close();
    });
  }

  function remove(roleName: string) {
    if (!window.confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      await deleteRole(roleName);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-charcoal-900">{t("role")}</h2>
        <Button size="sm" onClick={beginCreate}><Plus className="h-4 w-4" /> {t("new")}</Button>
      </div>

      {(creating || editing) && (
        <form onSubmit={save} className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-charcoal-900">{creating ? t("new") : t("edit")}</h3>
            <button type="button" onClick={close} className="rounded-lg p-1.5 text-charcoal-500 hover:bg-charcoal-50"><X className="h-4 w-4" /></button>
          </div>
          <div className="mb-4 max-w-xs">
            <label className="label">{t("name")}</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required disabled={editing?.name === "super_admin"} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERMISSION_GROUPS.map((g) => (
              <div key={g.group} className="rounded-xl bg-charcoal-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-charcoal-500">{g.group}</p>
                {g.perms.map((p) => (
                  <label key={p} className="flex items-center gap-2 py-1 text-sm text-charcoal-700">
                    <input type="checkbox" className="h-4 w-4 rounded text-brand-600" checked={selected.includes(p)} onChange={() => toggle(p)} />
                    {p}
                  </label>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit" loading={pending}>{t("save")}</Button>
            <Button type="button" variant="secondary" onClick={close}>{t("cancel")}</Button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("name")}</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">{t("permissions")}</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {roles.map((r) => {
              const perms = Array.isArray(r.permissions) ? (r.permissions as unknown as string[]) : [];
              return (
                <tr key={r.id} className="hover:bg-charcoal-50">
                  <td className="px-4 py-3 font-medium text-charcoal-900">{r.name}</td>
                  <td className="px-4 py-3 text-charcoal-600">
                    {r.name === "super_admin" ? t("all") : `${perms.length} ${t("permissions").toLowerCase()}`}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => beginEdit(r)} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50"><Pencil className="inline h-3.5 w-3.5" /> {t("edit")}</button>
                      {r.name !== "super_admin" && (
                        <button onClick={() => remove(r.name)} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> {t("delete")}</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
