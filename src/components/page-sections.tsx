import { notFound } from "next/navigation";
import { getPage, getPageSections } from "@/lib/data/public";
import { SectionRenderer } from "@/components/sections";

export async function PageSections({ slug }: { slug: string }) {
  const page = await getPage(slug);
  if (!page) notFound();
  const sections = await getPageSections(page.id);
  return (
    <>
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          type={section.type}
          content={section.content as Record<string, unknown>}
        />
      ))}
    </>
  );
}
