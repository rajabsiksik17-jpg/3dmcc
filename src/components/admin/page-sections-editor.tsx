"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { saveSection, deleteSection, reorderSection, reorderSections, duplicateSection } from "@/app/admin/actions/content";
import type { PageSectionRow } from "@/types/database";
import { ChevronUp, ChevronDown, Trash2, Plus, Copy, GripVertical } from "lucide-react";

const SECTION_TYPES = [
  "hero", "rich_text", "image_text", "services_grid", "courses_grid", "features",
  "approach", "vision_mission", "core_values", "timeline", "stats", "team", "clients",
  "partners", "testimonials", "cta", "contact", "faq", "gallery", "logo_cloud",
  "newsletter", "spacer", "divider",
];

export function PageSectionsEditor({ pageId, sections }: { pageId: string; sections: PageSectionRow[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ type: "hero", content: "{}" });
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  function onDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const ordered = [...sections];
    const [moved] = ordered.splice(dragIndex, 1);
    ordered.splice(targetIndex, 0, moved);
    run(() => reorderSections(ordered.map((s) => s.id)));
    setDragIndex(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-charcoal-900">{t("sections")}</h2>
        <Button size="sm" onClick={() => { setAdding(true); setEditingId(null); setForm({ type: "hero", content: "{}" }); }}>
          <Plus className="h-4 w-4" /> {t("addSection")}
        </Button>
      </div>

      {(adding || editingId) && (
        <div className="mb-6 rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 font-medium text-charcoal-900">{adding ? t("addSection") : t("editSection")}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">{t("sectionType")}</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {SECTION_TYPES.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t("contentJson")}</label>
              <textarea rows={10} className="input font-mono text-xs" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              <p className="mt-1 text-xs text-charcoal-400">{t("contentHint")}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              loading={pending}
              onClick={() =>
                run(() =>
                  saveSection({
                    id: editingId ?? undefined,
                    page_id: pageId,
                    type: form.type,
                    content: form.content,
                    position: editingId ? undefined : sections.length + 1,
                    visibility: "visible",
                    status: "published",
                  })
                )
              }
            >
              {t("save")}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => { setAdding(false); setEditingId(null); }}>{t("cancel")}</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sections.length === 0 ? (
          <div className="rounded-2xl border border-charcoal-100 bg-white py-10 text-center text-sm text-charcoal-500 shadow-card">
            {t("noSections")}
          </div>
        ) : (
          sections.map((s, i) => (
            <div
              key={s.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(i)}
              className="flex items-center gap-3 rounded-xl border border-charcoal-100 bg-white px-4 py-3 shadow-card"
            >
              <span className="cursor-grab text-charcoal-300"><GripVertical className="h-4 w-4" /></span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-charcoal-100 text-xs font-bold text-charcoal-600">{s.position}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-charcoal-900">{s.type}</p>
                <p className="truncate text-xs text-charcoal-400">{JSON.stringify(s.content).slice(0, 80)}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${s.visibility === "visible" ? "bg-emerald-50 text-emerald-600" : "bg-charcoal-100 text-charcoal-500"}`}>{s.visibility}</span>
              <div className="flex items-center gap-0.5">
                <button onClick={() => run(() => reorderSection(s.id, "up"))} disabled={i === 0 || pending} className="flex h-7 w-7 items-center justify-center rounded-lg text-charcoal-500 hover:bg-charcoal-50 disabled:opacity-30" aria-label={t("moveUp")}>
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button onClick={() => run(() => reorderSection(s.id, "down"))} disabled={i === sections.length - 1 || pending} className="flex h-7 w-7 items-center justify-center rounded-lg text-charcoal-500 hover:bg-charcoal-50 disabled:opacity-30" aria-label={t("moveDown")}>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setEditingId(s.id); setAdding(false); setForm({ type: s.type, content: JSON.stringify(s.content, null, 2) }); }}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50"
                >
                  {t("edit")}
                </button>
                <button onClick={() => run(() => duplicateSection(s.id))} className="flex h-7 w-7 items-center justify-center rounded-lg text-charcoal-500 hover:bg-charcoal-50" aria-label={t("new")}>
                  <Copy className="h-4 w-4" />
                </button>
                <button onClick={() => { if (window.confirm(t("deleteSection"))) run(() => deleteSection(s.id)); }} className="flex h-7 w-7 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" aria-label={t("delete")}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
