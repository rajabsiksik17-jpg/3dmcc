"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveSection, deleteSection, reorderSection } from "@/app/admin/actions/content";
import type { PageSectionRow } from "@/types/database";
import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";

const SECTION_TYPES = [
  "hero", "rich_text", "image_text", "services_grid", "courses_grid", "features",
  "approach", "vision_mission", "core_values", "timeline", "stats", "team", "clients",
  "partners", "testimonials", "cta", "contact", "faq", "gallery", "logo_cloud",
  "newsletter", "spacer", "divider",
];

export function PageSectionsEditor({ pageId, sections }: { pageId: string; sections: PageSectionRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ type: "hero", content: "{}" });

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-charcoal-900">Sections</h2>
        <Button size="sm" onClick={() => { setAdding(true); setEditingId(null); setForm({ type: "hero", content: "{}" }); }}>
          <Plus className="h-4 w-4" /> Add Section
        </Button>
      </div>

      {(adding || editingId) && (
        <div className="mb-6 rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 font-medium text-charcoal-900">{adding ? "Add Section" : "Edit Section"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {SECTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Content (JSON)</label>
              <textarea rows={10} className="input font-mono text-xs" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              <p className="mt-1 text-xs text-charcoal-400">
                Content keys use *_en and *_ar suffixes for bilingual text (e.g. title_en, title_ar).
              </p>
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
              Save
            </Button>
            <Button size="sm" variant="secondary" onClick={() => { setAdding(false); setEditingId(null); }}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sections.length === 0 ? (
          <div className="rounded-2xl border border-charcoal-100 bg-white py-10 text-center text-sm text-charcoal-500 shadow-card">
            No sections yet. Add your first section.
          </div>
        ) : (
          sections.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-charcoal-100 bg-white px-4 py-3 shadow-card">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-charcoal-100 text-xs font-bold text-charcoal-600">{s.position}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-charcoal-900">{s.type}</p>
                <p className="truncate text-xs text-charcoal-400">{JSON.stringify(s.content).slice(0, 80)}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${s.visibility === "visible" ? "bg-emerald-50 text-emerald-600" : "bg-charcoal-100 text-charcoal-500"}`}>{s.visibility}</span>
              <div className="flex items-center gap-0.5">
                <button onClick={() => run(() => reorderSection(s.id, "up"))} disabled={i === 0 || pending} className="flex h-7 w-7 items-center justify-center rounded-lg text-charcoal-500 hover:bg-charcoal-50 disabled:opacity-30" aria-label="Move up">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button onClick={() => run(() => reorderSection(s.id, "down"))} disabled={i === sections.length - 1 || pending} className="flex h-7 w-7 items-center justify-center rounded-lg text-charcoal-500 hover:bg-charcoal-50 disabled:opacity-30" aria-label="Move down">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setEditingId(s.id); setAdding(false); setForm({ type: s.type, content: JSON.stringify(s.content, null, 2) }); }}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50"
                >
                  Edit
                </button>
                <button onClick={() => { if (window.confirm("Delete this section?")) run(() => deleteSection(s.id)); }} className="flex h-7 w-7 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" aria-label="Delete">
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
