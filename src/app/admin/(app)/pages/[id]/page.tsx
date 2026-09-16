import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adminPages, adminPageSections } from "@/lib/admin-data";
import { PageSectionsEditor } from "@/components/admin/page-sections-editor";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

export default async function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { t } = await getAdminT();
  const { id } = await params;
  const pages = await adminPages();
  const page = pages.find((p) => p.id === id);
  if (!page) notFound();

  const sections = await adminPageSections(id);

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/pages" className="text-sm text-charcoal-500 hover:text-brand-600">{t("backToPages")}</Link>
        <h1 className="mt-1 text-xl font-semibold text-charcoal-900">{page.title_en}</h1>
      </div>
      <PageSectionsEditor pageId={id} sections={sections} />
    </div>
  );
}
