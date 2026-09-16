import { useLocale } from "next-intl";
import { localized } from "@/lib/utils";
import type { TeamMemberRow } from "@/types/database";
import { Linkedin, Mail } from "lucide-react";

export function TeamCard({ member }: { member: TeamMemberRow }) {
  const locale = useLocale() as "en" | "ar";
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-charcoal-100 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="h-24 w-24 overflow-hidden rounded-full bg-charcoal-100">
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo}
            alt={localized(locale, { en: member.name_en, ar: member.name_ar })}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-charcoal-400">
            {member.name_en.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="mt-4 font-semibold text-charcoal-900">
        {localized(locale, { en: member.name_en, ar: member.name_ar })}
      </h3>
      <p className="mt-1 text-sm text-brand-600">
        {localized(locale, { en: member.position_en, ar: member.position_ar })}
      </p>
      {member.bio_en && (
        <p className="mt-3 text-sm leading-relaxed text-charcoal-600 line-clamp-3">
          {localized(locale, { en: member.bio_en, ar: member.bio_ar })}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal-50 text-charcoal-600 transition-colors hover:bg-brand-500 hover:text-white"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal-50 text-charcoal-600 transition-colors hover:bg-brand-500 hover:text-white"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
