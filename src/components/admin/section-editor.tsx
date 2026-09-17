"use client";

import { useTranslations } from "next-intl";
import { MediaPicker } from "./media-picker";
import { IconPicker } from "./icon-picker";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Content = Record<string, unknown>;

function str(c: Content, k: string): string {
  return typeof c[k] === "string" ? (c[k] as string) : "";
}
function arr(c: Content, k: string): Record<string, unknown>[] {
  return Array.isArray(c[k]) ? (c[k] as Record<string, unknown>[]) : [];
}

export function SectionEditor({
  type,
  content,
  onChange,
}: {
  type: string;
  content: Content;
  onChange: (c: Content) => void;
}) {
  const t = useTranslations();

  function set(k: string, v: unknown) {
    onChange({ ...content, [k]: v });
  }

  function setItems(k: string, items: Record<string, unknown>[]) {
    set(k, items);
  }

  return (
    <div className="space-y-4">
      {(["hero", "image_text", "rich_text", "features", "approach", "core_values", "vision_mission", "timeline", "stats", "cta", "faq", "services_grid", "courses_grid", "team", "testimonials", "clients", "partners", "contact"].includes(type)) && (
        <>
          {type !== "cta" && type !== "vision_mission" && (
            <BilingualText
              labelEn="Eyebrow (English)"
              labelAr="Eyebrow (Arabic)"
              en={str(content, "eyebrow_en")}
              ar={str(content, "eyebrow_ar")}
              onChange={(en, ar) => { set("eyebrow_en", en); set("eyebrow_ar", ar); }}
            />
          )}
          <BilingualText
            labelEn="Title (English)"
            labelAr="Title (Arabic)"
            en={str(content, "title_en")}
            ar={str(content, "title_ar")}
            onChange={(en, ar) => { set("title_en", en); set("title_ar", ar); }}
          />
          {!["vision_mission", "timeline", "stats"].includes(type) && (
            <BilingualTextarea
              labelEn="Subtitle / Description (English)"
              labelAr="Subtitle / Description (Arabic)"
              en={str(content, "subtitle_en") || str(content, "text_en")}
              ar={str(content, "subtitle_ar") || str(content, "text_ar")}
              onChange={(en, ar) => {
                if (["image_text", "rich_text"].includes(type)) {
                  set("text_en", en); set("text_ar", ar);
                } else {
                  set("subtitle_en", en); set("subtitle_ar", ar);
                }
              }}
            />
          )}
        </>
      )}

      {type === "image_text" && (
        <div className="space-y-3 rounded-xl bg-charcoal-50 p-4">
          <ImageField label="Image" value={str(content, "image")} onChange={(v) => set("image", v)} />
          <div className="flex items-center gap-4">
            <label className="label">Image Position</label>
            <select className="input max-w-xs" value={str(content, "image_position") || "right"} onChange={(e) => set("image_position", e.target.value)}>
              <option value="right">Image Right</option>
              <option value="left">Image Left</option>
            </select>
          </div>
          <ButtonFields
            content={content}
            onChange={(label, url) => { set("primary_label_en", label.en); set("primary_label_ar", label.ar); set("primary_url", url); }}
          />
        </div>
      )}

      {type === "hero" && (
        <div className="space-y-3 rounded-xl bg-charcoal-50 p-4">
          <ButtonFields
            content={content}
            onChange={(label, url) => { set("primary_label_en", label.en); set("primary_label_ar", label.ar); set("primary_url", url); }}
          />
          <ButtonFields
            secondary
            content={content}
            onChange={(label, url) => { set("secondary_label_en", label.en); set("secondary_label_ar", label.ar); set("secondary_url", url); }}
          />
        </div>
      )}

      {type === "cta" && (
        <div className="space-y-3 rounded-xl bg-charcoal-50 p-4">
          <BilingualTextarea
            labelEn="Text (English)"
            labelAr="Text (Arabic)"
            en={str(content, "text_en")}
            ar={str(content, "text_ar")}
            onChange={(en, ar) => { set("text_en", en); set("text_ar", ar); }}
          />
          <ButtonFields content={content} onChange={(label, url) => { set("primary_label_en", label.en); set("primary_label_ar", label.ar); set("primary_url", url); }} />
          <ButtonFields secondary content={content} onChange={(label, url) => { set("secondary_label_en", label.en); set("secondary_label_ar", label.ar); set("secondary_url", url); }} />
        </div>
      )}

      {type === "vision_mission" && (
        <div className="space-y-3">
          <BilingualTextarea labelEn="Vision (English)" labelAr="Vision (Arabic)" en={str(content, "vision_en")} ar={str(content, "vision_ar")} onChange={(en, ar) => { set("vision_en", en); set("vision_ar", ar); }} />
          <BilingualTextarea labelEn="Mission (English)" labelAr="Mission (Arabic)" en={str(content, "mission_en")} ar={str(content, "mission_ar")} onChange={(en, ar) => { set("mission_en", en); set("mission_ar", ar); }} />
        </div>
      )}

      {["features", "approach", "core_values"].includes(type) && (
        <ItemsEditor
          items={arr(content, "items")}
          fields={["icon", "title", "text"]}
          onChange={(items) => setItems("items", items)}
        />
      )}

      {type === "timeline" && (
        <ItemsEditor
          items={arr(content, "items")}
          fields={["year", "title", "text"]}
          onChange={(items) => setItems("items", items)}
        />
      )}

      {type === "stats" && (
        <ItemsEditor
          items={arr(content, "items")}
          fields={["value", "label"]}
          onChange={(items) => setItems("items", items)}
        />
      )}

      {type === "rich_text" && (
        <BilingualTextarea
          labelEn="Content (English)"
          labelAr="Content (Arabic)"
          en={str(content, "content_en")}
          ar={str(content, "content_ar")}
          onChange={(en, ar) => { set("content_en", en); set("content_ar", ar); }}
        />
      )}

      {["services_grid", "courses_grid"].includes(type) && (
        <div className="flex items-center gap-4">
          <label className="label">Items limit</label>
          <input type="number" className="input max-w-[120px]" value={typeof content.limit === "number" ? content.limit : ""} onChange={(e) => set("limit", Number(e.target.value))} />
        </div>
      )}

      {["spacer", "divider"].includes(type) && <p className="text-sm text-charcoal-500">{t("noFields")}</p>}
    </div>
  );
}

function BilingualText({ labelEn, labelAr, en, ar, onChange }: { labelEn: string; labelAr: string; en: string; ar: string; onChange: (en: string, ar: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="label">{labelEn}</label>
        <input className="input" value={en} onChange={(e) => onChange(e.target.value, ar)} />
      </div>
      <div>
        <label className="label">{labelAr}</label>
        <input className="input" dir="rtl" value={ar} onChange={(e) => onChange(en, e.target.value)} />
      </div>
    </div>
  );
}

function BilingualTextarea({ labelEn, labelAr, en, ar, onChange }: { labelEn: string; labelAr: string; en: string; ar: string; onChange: (en: string, ar: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="label">{labelEn}</label>
        <textarea rows={3} className="input" value={en} onChange={(e) => onChange(e.target.value, ar)} />
      </div>
      <div>
        <label className="label">{labelAr}</label>
        <textarea rows={3} className="input" dir="rtl" value={ar} onChange={(e) => onChange(en, e.target.value)} />
      </div>
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <MediaPicker value={value || null} onChange={onChange} onClear={() => onChange("")} />
    </div>
  );
}

function ButtonFields({ content, onChange, secondary }: { content: Content; secondary?: boolean; onChange: (label: { en: string; ar: string }, url: string) => void }) {
  const prefix = secondary ? "secondary" : "primary";
  const en = str(content, `${prefix}_label_en`);
  const ar = str(content, `${prefix}_label_ar`);
  const url = str(content, `${prefix}_url`);
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">{secondary ? "Secondary Button" : "Primary Button"}</p>
      <BilingualText labelEn="Label (English)" labelAr="Label (Arabic)" en={en} ar={ar} onChange={(e, a) => onChange({ en: e, ar: a }, url)} />
      <div>
        <label className="label">Link URL</label>
        <input className="input" value={url} placeholder="/services" onChange={(e) => onChange({ en, ar }, e.target.value)} />
      </div>
    </div>
  );
}

function ItemsEditor({
  items,
  fields,
  onChange,
}: {
  items: Record<string, unknown>[];
  fields: string[];
  onChange: (items: Record<string, unknown>[]) => void;
}) {
  const t = useTranslations();

  function update(index: number, patch: Record<string, unknown>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange(next);
  }
  function add() {
    onChange([...items, {}]);
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">Items</p>
        <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50">
          <Plus className="h-3.5 w-3.5" /> Add Item
        </button>
      </div>
      {items.length === 0 && <p className="text-sm text-charcoal-400">No items yet.</p>}
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-charcoal-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-500">Item {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="rounded-lg p-1 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </div>
          {fields.includes("icon") && (
            <div className="mb-3">
              <label className="label">Icon</label>
              <IconPicker value={str(item, "icon") || null} onChange={(v) => update(i, { icon: v })} onClear={() => update(i, { icon: "" })} />
            </div>
          )}
          {fields.includes("year") && (
            <div className="mb-3">
              <label className="label">Year</label>
              <input className="input" value={str(item, "year")} onChange={(e) => update(i, { year: e.target.value })} />
            </div>
          )}
          {fields.includes("value") && (
            <div className="mb-3">
              <label className="label">Value</label>
              <input className="input" value={str(item, "value")} onChange={(e) => update(i, { value: e.target.value })} />
            </div>
          )}
          {fields.includes("title") && (
            <BilingualText
              labelEn="Title (English)"
              labelAr="Title (Arabic)"
              en={str(item, "title_en")}
              ar={str(item, "title_ar")}
              onChange={(en, ar) => update(i, { title_en: en, title_ar: ar })}
            />
          )}
          {fields.includes("text") && (
            <div className="mt-3">
              <BilingualTextarea
                labelEn="Text (English)"
                labelAr="Text (Arabic)"
                en={str(item, "text_en")}
                ar={str(item, "text_ar")}
                onChange={(en, ar) => update(i, { text_en: en, text_ar: ar })}
              />
            </div>
          )}
          {fields.includes("label") && (
            <BilingualText
              labelEn="Label (English)"
              labelAr="Label (Arabic)"
              en={str(item, "label_en")}
              ar={str(item, "label_ar")}
              onChange={(en, ar) => update(i, { label_en: en, label_ar: ar })}
            />
          )}
        </div>
      ))}
    </div>
  );
}
