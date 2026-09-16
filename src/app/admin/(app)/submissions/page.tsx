import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminSubmissions } from "@/lib/admin-data";
import { archiveSubmission } from "@/app/admin/actions/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { Archive } from "lucide-react";

export const dynamic = "force-dynamic";

const TYPES = [
  { value: "contact", label: "Contact" },
  { value: "service", label: "Service" },
  { value: "career", label: "Career" },
  { value: "course", label: "Course" },
];

const STATUSES = ["new", "contacted", "in_progress", "completed", "rejected", "archived"];

export default async function SubmissionsPage({ searchParams }: { searchParams: Promise<{ type?: string; status?: string }> }) {
  await requireAdmin();
  const { type, status } = await searchParams;
  const submissions = await adminSubmissions({ type, status });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-charcoal-900">Submissions</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/submissions"
          className={!type ? "btn-primary !py-1.5" : "btn-secondary !py-1.5"}
        >
          All
        </Link>
        {TYPES.map((t) => (
          <Link
            key={t.value}
            href={`/admin/submissions?type=${t.value}`}
            className={type === t.value ? "btn-primary !py-1.5" : "btn-secondary !py-1.5"}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-charcoal-100 bg-charcoal-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Customer</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Type</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Contact</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Status</th>
              <th className="px-4 py-3 text-start font-medium text-charcoal-600">Date</th>
              <th className="px-4 py-3 text-end font-medium text-charcoal-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-charcoal-500">No submissions found.</td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s.id} className="hover:bg-charcoal-50">
                  <td className="px-4 py-3 font-medium text-charcoal-900">{s.customer_name || "—"}</td>
                  <td className="px-4 py-3 text-charcoal-600">{s.form_type}</td>
                  <td className="px-4 py-3 text-charcoal-600">
                    <span className="block text-xs">{s.email || "—"}</span>
                    <span className="block text-xs text-charcoal-400">{s.phone || ""}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-charcoal-600">{new Date(s.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/submissions/${s.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50">View</Link>
                      <DeleteButton action={archiveSubmission.bind(null, s.id)} confirmText="Archive this submission?" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
