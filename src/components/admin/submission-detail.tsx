"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSubmission } from "@/app/admin/actions/content";
import { Button } from "@/components/ui/button";
import type { FormSubmissionRow } from "@/types/database";

const STATUSES = ["new", "contacted", "in_progress", "completed", "rejected", "archived"];

export function SubmissionDetail({
  submission,
  values,
  users,
}: {
  submission: FormSubmissionRow;
  values: { id: string; field_name: string; field_label: string | null; value: unknown }[];
  users: { id: string; full_name: string | null; email: string | null }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function update(patch: { status?: string; assigned_to?: string | null; notes?: string | null }) {
    startTransition(async () => {
      await updateSubmission({ id: submission.id, ...patch });
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-charcoal-100 bg-white shadow-card">
          <div className="border-b border-charcoal-100 px-6 py-4">
            <h2 className="font-semibold text-charcoal-900">Submission Details</h2>
          </div>
          <dl className="divide-y divide-charcoal-100">
            <div className="grid grid-cols-2 gap-2 px-6 py-3">
              <dt className="text-sm text-charcoal-500">Type</dt>
              <dd className="text-sm font-medium text-charcoal-900">{submission.form_type}</dd>
            </div>
            {values.map((v) => (
              <div key={v.id} className="grid grid-cols-2 gap-2 px-6 py-3">
                <dt className="text-sm text-charcoal-500">{v.field_label || v.field_name}</dt>
                <dd className="text-sm text-charcoal-900 break-words">
                  {formatValue(v.value)}
                </dd>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 px-6 py-3">
              <dt className="text-sm text-charcoal-500">Submitted</dt>
              <dd className="text-sm text-charcoal-900">{new Date(submission.created_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-card">
          <label className="label">Status</label>
          <select
            className="input"
            value={submission.status}
            onChange={(e) => update({ status: e.target.value })}
            disabled={pending}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-card">
          <label className="label">Assigned To</label>
          <select
            className="input"
            value={submission.assigned_to ?? ""}
            onChange={(e) => update({ assigned_to: e.target.value || null })}
            disabled={pending}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-card">
          <label className="label">Notes</label>
          <NotesEditor submissionId={submission.id} initial={submission.notes ?? ""} />
        </div>
      </div>
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function NotesEditor({ submissionId, initial }: { submissionId: string; initial: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(initial);

  function save() {
    startTransition(async () => {
      await updateSubmission({ id: submissionId, notes: value });
      router.refresh();
    });
  }

  return (
    <div>
      <textarea rows={4} className="input" value={value} onChange={(e) => setValue(e.target.value)} />
      <Button size="sm" className="mt-2" loading={pending} onClick={save}>Save Note</Button>
    </div>
  );
}
