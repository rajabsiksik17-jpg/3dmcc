"use client";

import { usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { MessageCircle, Phone, X, Mail } from "lucide-react";
import { useState } from "react";
import type { CompanySettingsRow } from "@/types/database";

export function FloatingContact({ company }: { company: CompanySettingsRow | null }) {
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const hidden = pathname.startsWith(`/${locale}/contact`);
  if (hidden) return null;

  const phone = company?.phone?.replace(/\s/g, "");
  const whatsapp = company?.whatsapp?.replace(/[^0-9]/g, "");

  return (
    <div className="fixed bottom-5 z-40 flex flex-col items-end gap-2 ltr:right-5 rtl:left-5">
      {open && (
        <div className="flex flex-col gap-2">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lift transition-transform hover:scale-105"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-900 text-white shadow-lift transition-transform hover:scale-105"
              aria-label="Call"
            >
              <Phone className="h-5 w-5" />
            </a>
          )}
          <a
            href={`/${locale}/contact`}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lift transition-transform hover:scale-105"
            aria-label="Contact"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lift transition-transform hover:scale-105"
        aria-label="Contact options"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
