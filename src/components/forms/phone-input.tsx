"use client";

import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";
import { COUNTRIES, flagEmoji, getCountryByCode, countryName } from "@/lib/countries";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhoneValue {
  countryCode: string;
  dialCode: string;
  nationalNumber: string;
  internationalNumber: string;
}

function formatNational(value: string): string {
  return value.replace(/[^\d]/g, "");
}

export function PhoneInput({
  value,
  onChange,
  invalid,
  name,
}: {
  value?: PhoneValue | null;
  onChange?: (v: PhoneValue) => void;
  invalid?: boolean;
  name?: string;
}) {
  const locale = useLocale();
  const [country, setCountry] = useState(getCountryByCode(value?.countryCode ?? "JO"));
  const [national, setNational] = useState(value?.nationalNumber ?? "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.nameAr.includes(q) || c.dialCode.includes(q)
    );
  }, [query]);

  function emit(cc: typeof country, nationalNumber: string) {
    const digits = formatNational(nationalNumber);
    const full = `${cc.dialCode}${digits}`;
    let internationalNumber = full;
    try {
      const parsed = parsePhoneNumberFromString(full);
      if (parsed) internationalNumber = parsed.format("E.164");
    } catch {
      // keep as-is
    }
    onChange?.({ countryCode: cc.code, dialCode: cc.dialCode, nationalNumber: digits, internationalNumber });
  }

  function selectCountry(c: (typeof COUNTRIES)[number]) {
    setCountry(c);
    setOpen(false);
    setQuery("");
    emit(c, national);
  }

  const valid = useMemo(() => {
    if (!national) return true;
    try {
      return isValidPhoneNumber(`${country.dialCode}${national}`);
    } catch {
      return false;
    }
  }, [national, country]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-lg border bg-white transition-colors focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20",
          invalid || !valid ? "border-red-400" : "border-charcoal-200"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 border-r border-charcoal-100 px-3 py-2.5 text-sm text-charcoal-700 hover:bg-charcoal-50"
          aria-label="Select country"
        >
          <span className="text-lg leading-none">{flagEmoji(country.code)}</span>
          <span className="font-medium" dir="ltr">{country.dialCode}</span>
          <ChevronDown className="h-4 w-4 text-charcoal-400" />
        </button>
        <input
          type="tel"
          inputMode="tel"
          name={name}
          dir="ltr"
          value={national}
          onChange={(e) => {
            setNational(formatNational(e.target.value));
            emit(country, e.target.value);
          }}
          placeholder="7XXXXXXXX"
          className="w-full bg-transparent px-3 py-2.5 text-sm text-charcoal-900 outline-none placeholder:text-charcoal-400"
        />
      </div>
      {!valid && national && (
        <p className="mt-1 text-xs text-red-500">
          {locale === "ar" ? "يرجى إدخال رقم هاتف صحيح." : "Please enter a valid phone number."}
        </p>
      )}

      {open && (
        <div className="absolute z-30 mt-1 max-h-72 w-full overflow-hidden rounded-lg border border-charcoal-200 bg-white shadow-lift">
          <div className="flex items-center gap-2 border-b border-charcoal-100 px-3 py-2">
            <Search className="h-4 w-4 text-charcoal-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={locale === "ar" ? "ابحث عن دولة..." : "Search country..."}
              className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal-400"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => selectCountry(c)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm text-charcoal-800 hover:bg-charcoal-50",
                    c.code === country.code && "bg-brand-50 text-brand-700"
                  )}
                >
                  <span className="text-base">{flagEmoji(c.code)}</span>
                  <span className="flex-1 text-start">{countryName(c, locale)}</span>
                  <span className="text-charcoal-500" dir="ltr">{c.dialCode}</span>
                  {c.code === country.code && <Check className="h-4 w-4 text-brand-600" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
