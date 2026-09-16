import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-charcoal-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-charcoal-300 rtl:rotate-180" />}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-brand-600">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-charcoal-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
