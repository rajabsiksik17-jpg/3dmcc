"use client";

import { useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { localized } from "@/lib/utils";
import type { CategoryRow, CourseRow } from "@/types/database";
import { CourseCard } from "@/components/cards/course-card";
import { Search } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export function CoursesExplorer({
  courses,
  categories,
}: {
  courses: CourseRow[];
  categories: CategoryRow[];
}) {
  const locale = useLocale() as "en" | "ar";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 9;

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory = category === "all" || c.category_id === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q || c.title_en.toLowerCase().includes(q) || c.title_ar.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [courses, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400 ltr:left-3 rtl:right-3" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={locale === "ar" ? "ابحث عن دورة..." : "Search courses..."}
            className="input ltr:pl-9 rtl:pr-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setCategory("all");
              setPage(1);
            }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              category === "all"
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-charcoal-200 text-charcoal-700 hover:border-brand-300"
            )}
          >
            {locale === "ar" ? "الكل" : "All"}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.id);
                setPage(1);
              }}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                category === c.id
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-charcoal-200 text-charcoal-700 hover:border-brand-300"
              )}
            >
              {localized(locale, { en: c.name_en, ar: c.name_ar })}
            </button>
          ))}
        </div>
      </div>

      {pageItems.length === 0 ? (
        <p className="py-16 text-center text-charcoal-500">
          {locale === "ar" ? "لا توجد نتائج مطابقة." : "No matching results."}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}

      {filtered.length > perPage && (
        <div className="mt-10">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
