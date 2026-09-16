export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dialCode: string;
}

export const COUNTRIES: Country[] = [
  { code: "JO", name: "Jordan", dialCode: "+962" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971" },
  { code: "KW", name: "Kuwait", dialCode: "+965" },
  { code: "QA", name: "Qatar", dialCode: "+974" },
  { code: "BH", name: "Bahrain", dialCode: "+973" },
  { code: "OM", name: "Oman", dialCode: "+968" },
  { code: "IQ", name: "Iraq", dialCode: "+964" },
  { code: "LB", name: "Lebanon", dialCode: "+961" },
  { code: "SY", name: "Syria", dialCode: "+963" },
  { code: "PS", name: "Palestine", dialCode: "+970" },
  { code: "EG", name: "Egypt", dialCode: "+20" },
  { code: "TR", name: "Turkey", dialCode: "+90" },
  { code: "MA", name: "Morocco", dialCode: "+212" },
  { code: "DZ", name: "Algeria", dialCode: "+213" },
  { code: "TN", name: "Tunisia", dialCode: "+216" },
  { code: "LY", name: "Libya", dialCode: "+218" },
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "IT", name: "Italy", dialCode: "+39" },
  { code: "ES", name: "Spain", dialCode: "+34" },
  { code: "NL", name: "Netherlands", dialCode: "+31" },
  { code: "IN", name: "India", dialCode: "+91" },
  { code: "PK", name: "Pakistan", dialCode: "+92" },
  { code: "CN", name: "China", dialCode: "+86" },
  { code: "RU", name: "Russia", dialCode: "+7" },
  { code: "AU", name: "Australia", dialCode: "+61" },
];

export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const base = 0x1f1e6;
  return String.fromCodePoint(base + code.charCodeAt(0) - 65, base + code.charCodeAt(1) - 65);
}

export function getCountryByCode(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}
