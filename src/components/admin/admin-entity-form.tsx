"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconPicker } from "./icon-picker";
import { MediaPicker } from "./media-picker";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "toggle" | "icon" | "image" | "list";
  options?: { value: string; label: string }[];
  placeholder?: string;
  half?: boolean;
  step?: number;
};

export function AdminEntityForm({
  fields,
  initial,
  action,
  submitLabel = "save",
  cancelHref,
}: {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  action: (input: unknown) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
  cancelHref: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const v: Record<string, unknown> = { ...initial };
    for (const f of fields) {
      if (v[f.name] === undefined || v[f.name] === null) {
        v[f.name] = f.type === "toggle" ? false : f.type === "number" ? 0 : f.type === "list" ? [] : "";
      }
    }
    return v;
  });

  function set(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await action(values);
      if (res.ok) {
        router.push(cancelHref);
        router.refresh();
      } else {
        setError(res.error ?? "Something went wrong");
      }
    });
  }

  const label = (key: string) => {
    const found = t.has(key) ? t(key) : key;
    return found;
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const val = values[f.name];

          if (f.type === "textarea") {
            return (
              <div key={f.name} className="sm:col-span-2">
                <label className="label">{label(f.label)}</label>
                <textarea
                  rows={4}
                  className="input"
                  value={String(val ?? "")}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              </div>
            );
          }

          if (f.type === "list") {
            const arr = Array.isArray(val) ? (val as string[]) : [];
            return (
              <div key={f.name} className="sm:col-span-2">
                <label className="label">{label(f.label)}</label>
                <textarea
                  rows={4}
                  className="input"
                  value={arr.join("\n")}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    set(
                      f.name,
                      e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                />
                <p className="mt-1 text-xs text-charcoal-400">{t("listHint")}</p>
              </div>
            );
          }

          if (f.type === "select") {
            return (
              <div key={f.name} className={cn(f.half ? "sm:col-span-1" : "sm:col-span-2")}>
                <label className="label">{label(f.label)}</label>
                <select className="input" value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)}>
                  <option value="">{t("select")}</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {label(o.label)}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (f.type === "icon") {
            return (
              <div key={f.name} className="sm:col-span-2">
                <label className="label">{label(f.label)}</label>
                <IconPicker
                  value={String(val ?? "") || null}
                  onChange={(name) => set(f.name, name)}
                  onClear={() => set(f.name, "")}
                />
              </div>
            );
          }

          if (f.type === "image") {
            return (
              <div key={f.name} className="sm:col-span-2">
                <label className="label">{label(f.label)}</label>
                <MediaPicker
                  value={String(val ?? "") || null}
                  onChange={(url) => set(f.name, url)}
                  onClear={() => set(f.name, "")}
                />
              </div>
            );
          }

          if (f.type === "toggle") {
            return (
              <div key={f.name} className={cn("flex items-center gap-2 pt-6", f.half ? "sm:col-span-1" : "sm:col-span-2")}>
                <input
                  type="checkbox"
                  id={f.name}
                  className="h-4 w-4 rounded text-brand-600"
                  checked={Boolean(val)}
                  onChange={(e) => set(f.name, e.target.checked)}
                />
                <label htmlFor={f.name} className="text-sm font-medium text-charcoal-700">
                  {label(f.label)}
                </label>
              </div>
            );
          }

          return (
            <div key={f.name} className={cn(f.half ? "sm:col-span-1" : "sm:col-span-2")}>
              <label className="label">{label(f.label)}</label>
              <input
                type={f.type === "number" ? "number" : "text"}
                step={f.step}
                className="input"
                value={String(val ?? "")}
                placeholder={f.placeholder}
                onChange={(e) => set(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)}
              />
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 flex items-center gap-2">
        <Button type="submit" loading={pending}>
          {t(submitLabel)}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push(cancelHref)}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
