import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adminSubmissions, adminSubmissionValues, adminProfiles } from "@/lib/admin-data";
import { SubmissionDetail } from "@/components/admin/submission-detail";

export const dynamic = "force-dynamic";

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const all = await adminSubmissions();
  const submission = all.find((s) => s.id === id);
  if (!submission) notFound();

  const [values, profiles] = await Promise.all([adminSubmissionValues(id), adminProfiles()]);

  return <SubmissionDetail submission={submission} values={values} users={profiles} />;
}
