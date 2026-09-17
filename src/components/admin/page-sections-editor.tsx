"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SectionEditor } from "./section-editor";
import { saveSection, deleteSection, reorderSection, reorderSections, duplicateSection } from "@/app/admin/actions/content";
import type { PageSectionRow } from "@/types/database";
import { ChevronUp, ChevronDown, Trash2, Plus, Copy, GripVertical } from "lucide-react";

const SECTION_TYPES: { value: string; label: string }[] = [
  { value: "hero", label: "Hero" },
  { value: "image_text", label: "Image + Text" },
  { value: "rich_text", label: "Rich Text" },
  { value: "services_grid", label: "Services Grid" },
  { value: "courses_grid", label: "Courses Grid" },
  { value: "features", label: "Features" },
  { value: "approach", label: "Approach" },
  { value: "vision_mission", label: "Vision & Mission" },
  { value: "core_values", label: "Core Values" },
  { value: "timeline", label: "Timeline" },
  { value: "stats", label: "Statistics" },
  { value: "team", label: "Team" },
  { value: "testimonials", label: "Testimonials" },
  { value: "clients", label: "Clients" },
  { value: "partners", label: "Partners" },
  { value: "cta", label: "Call to Action" },
  { value: "contact", label: "Contact" },
  { value: "faq", label: "FAQ" },
  { value: "spacer", label: "Spacer" },
  { value: "divider", label: "Divider" },
];

export function PageSectionsEditor({ pageId, sections }: { pageId: string; sections: PageSectionRow[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formType, setFormType] = useState("hero");
  const [content, setContent] = useState<Record<string, unknown>>({});
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

  function beginAdd() {
    setAdding(true);
    setEditingId(null);
    setFormType("hero");
    setContent({});
  }

  function beginEdit(s: PageSectionRow) {
    setEditingId(s.id);
    setAdding(false);
    setFormType(s.type);
    setContent((s.content as Record<string, unknown>) ?? {});
  }

  function save() {
    run(() =>
      saveSection({
        id: editingId ?? undefined,
        page_id: pageId,
        type: formType,
        content: JSON.stringify(content),
        position: editingId ? undefined : sections.length + 1,
        visibility: "visible",
        status: "published",
      })
    );
  }

  const labelOf = (type: string) => SECTION_TYPES.find((s) => s.value === type)?.label ?? type;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-charcoal-900">{t("sections")}</h2>
        <Button size="sm" onClick={beginAdd}>
          <Plus className="h-4 w-4" /> {t("addSection")}
        </Button>
      </div>

      {(adding || editingId) && (
        <div className="mb-6 rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 font-medium text-charcoal-900">{adding ? t("addSection") : t("editSection")}</h3>
          <div className="mb-4 max-w-xs">
            <label className="label">{t("sectionType")}</label>
            <select className="input" value={formType} onChange={(e) => setFormType(e.target.value)} disabled={Boolean(editingId)}>
              {SECTION_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <SectionEditor type={formType} content={content} onChange={setContent} />
          <div className="mt-5 flex gap-2">
            <Button size="sm" loading={pending} onClick={save}>{t("save")}</Button>
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
                <p className="font-medium text-charcoal-900">{labelOf(s.type)}</p>
                <p className="truncate text-xs text-charcoal-400">
                  {(() => {
                    const c = s.content as Record<string, unknown>;
                    return typeof c.title_en === "string" ? (c.title_en as string) : t("edit");
                  })()}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${s.visibility === "visible" ? "bg-emerald-50 text-emerald-600" : "bg-charcoal-100 text-charcoal-500"}`}>{s.visibility}</span>
              <div className="flex items-center gap-0.5">
                <button onClick={() => run(() => reorderSection(s.id, "up"))} disabled={i === 0 || pending} className="flex h-7 w-7 items-center justify-center rounded-lg text-charcoal-500 hover:bg-charcoal-50 disabled:opacity-30" aria-label={t("moveUp")}>
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button onClick={() => run(() => reorderSection(s.id, "down"))} disabled={i === sections.length - 1 || pending} className="flex h-7 w-7 items-center justify-center rounded-lg text-charcoal-500 hover:bg-charcoal-50 disabled:opacity-30" aria-label={t("moveDown")}>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button onClick={() => beginEdit(s)} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">{t("edit")}</button>
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
