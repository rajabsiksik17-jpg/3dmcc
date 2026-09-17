"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { saveFaq, deleteFaq } from "@/app/admin/actions/content";
import type { FaqRow } from "@/types/database";
import { Plus, Trash2, Pencil, X } from "lucide-react";

export function EntityFaqsEditor({
  entityType,
  entityId,
  faqs,
}: {
  entityType: "course" | "job";
  entityId: string;
  faqs: FaqRow[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<FaqRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ question_en: "", question_ar: "", answer_en: "", answer_ar: "" });

  function beginCreate() {
    setCreating(true);
    setEditing(null);
    setForm({ question_en: "", question_ar: "", answer_en: "", answer_ar: "" });
  }
  function beginEdit(f: FaqRow) {
    setEditing(f);
    setCreating(false);
    setForm({ question_en: f.question_en, question_ar: f.question_ar, answer_en: f.answer_en, answer_ar: f.answer_ar });
  }
  function close() {
    setCreating(false);
    setEditing(null);
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveFaq({
        id: editing?.id,
        ...form,
        published: true,
        sort_order: editing?.sort_order ?? faqs.length + 1,
        course_id: entityType === "course" ? entityId : null,
        job_id: entityType === "job" ? entityId : null,
      });
      router.refresh();
      close();
    });
  }
  function remove(id: string) {
    if (!window.confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      await deleteFaq(id);
      router.refresh();
    });
  }

  return (
    <div className="mt-6 rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-charcoal-900">{t("faqs")}</h3>
        <Button size="sm" onClick={beginCreate}><Plus className="h-4 w-4" /> {t("newFaq")}</Button>
      </div>

      {(creating || editing) && (
        <form onSubmit={save} className="mb-4 rounded-xl bg-charcoal-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">{t("questionEn")}</label><input className="input" value={form.question_en} onChange={(e) => setForm({ ...form, question_en: e.target.value })} required /></div>
            <div><label className="label">{t("questionAr")}</label><input className="input" dir="rtl" value={form.question_ar} onChange={(e) => setForm({ ...form, question_ar: e.target.value })} required /></div>
            <div><label className="label">{t("answerEn")}</label><textarea className="input" value={form.answer_en} onChange={(e) => setForm({ ...form, answer_en: e.target.value })} required /></div>
            <div><label className="label">{t("answerAr")}</label><textarea className="input" dir="rtl" value={form.answer_ar} onChange={(e) => setForm({ ...form, answer_ar: e.target.value })} required /></div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button type="submit" size="sm" loading={pending}>{t("save")}</Button>
            <Button type="button" size="sm" variant="secondary" onClick={close}>{t("cancel")}</Button>
          </div>
        </form>
      )}

      {faqs.length === 0 ? (
        <p className="py-4 text-center text-sm text-charcoal-400">{t("noFields")}</p>
      ) : (
        <ul className="divide-y divide-charcoal-100">
          {faqs.map((f) => (
            <li key={f.id} className="flex items-start gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-charcoal-900">{f.question_en}</p>
                <p className="text-sm text-charcoal-500 line-clamp-1">{f.answer_en}</p>
              </div>
              <button onClick={() => beginEdit(f)} className="rounded-lg p-1.5 text-charcoal-500 hover:bg-charcoal-50" aria-label={t("edit")}><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(f.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" aria-label={t("delete")}><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
