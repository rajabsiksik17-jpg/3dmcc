import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adminSubmissions, adminSubmissionValues, adminProfiles } from "@/lib/admin-data";
import { SubmissionDetail } from "@/components/admin/submission-detail";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const all = await adminSubmissions();
  const submission = all.find((s) => s.id === id);
  if (!submission) notFound();

  const [values, profiles] = await Promise.all([adminSubmissionValues(id), adminProfiles()]);

  // Mark as read when an admin opens the request
  if (!submission.read) {
    await createAdminClient().from("form_submissions").update({ read: true }).eq("id", id);
  }

  return <SubmissionDetail submission={submission} values={values} users={profiles} />;
}
