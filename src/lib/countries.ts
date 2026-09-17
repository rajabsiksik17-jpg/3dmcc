export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  nameAr: string;
  dialCode: string;
}

export const COUNTRIES: Country[] = [
  { code: "JO", name: "Jordan", nameAr: "الأردن", dialCode: "+962" },
  { code: "SA", name: "Saudi Arabia", nameAr: "السعودية", dialCode: "+966" },
  { code: "AE", name: "United Arab Emirates", nameAr: "الإمارات", dialCode: "+971" },
  { code: "KW", name: "Kuwait", nameAr: "الكويت", dialCode: "+965" },
  { code: "QA", name: "Qatar", nameAr: "قطر", dialCode: "+974" },
  { code: "BH", name: "Bahrain", nameAr: "البحرين", dialCode: "+973" },
  { code: "OM", name: "Oman", nameAr: "عُمان", dialCode: "+968" },
  { code: "IQ", name: "Iraq", nameAr: "العراق", dialCode: "+964" },
  { code: "LB", name: "Lebanon", nameAr: "لبنان", dialCode: "+961" },
  { code: "SY", name: "Syria", nameAr: "سوريا", dialCode: "+963" },
  { code: "PS", name: "Palestine", nameAr: "فلسطين", dialCode: "+970" },
  { code: "EG", name: "Egypt", nameAr: "مصر", dialCode: "+20" },
  { code: "TR", name: "Turkey", nameAr: "تركيا", dialCode: "+90" },
  { code: "MA", name: "Morocco", nameAr: "المغرب", dialCode: "+212" },
  { code: "DZ", name: "Algeria", nameAr: "الجزائر", dialCode: "+213" },
  { code: "TN", name: "Tunisia", nameAr: "تونس", dialCode: "+216" },
  { code: "LY", name: "Libya", nameAr: "ليبيا", dialCode: "+218" },
  { code: "US", name: "United States", nameAr: "الولايات المتحدة", dialCode: "+1" },
  { code: "CA", name: "Canada", nameAr: "كندا", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", nameAr: "المملكة المتحدة", dialCode: "+44" },
  { code: "DE", name: "Germany", nameAr: "ألمانيا", dialCode: "+49" },
  { code: "FR", name: "France", nameAr: "فرنسا", dialCode: "+33" },
  { code: "IT", name: "Italy", nameAr: "إيطاليا", dialCode: "+39" },
  { code: "ES", name: "Spain", nameAr: "إسبانيا", dialCode: "+34" },
  { code: "NL", name: "Netherlands", nameAr: "هولندا", dialCode: "+31" },
  { code: "IN", name: "India", nameAr: "الهند", dialCode: "+91" },
  { code: "PK", name: "Pakistan", nameAr: "باكستان", dialCode: "+92" },
  { code: "CN", name: "China", nameAr: "الصين", dialCode: "+86" },
  { code: "RU", name: "Russia", nameAr: "روسيا", dialCode: "+7" },
  { code: "AU", name: "Australia", nameAr: "أستراليا", dialCode: "+61" },
];

export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const base = 0x1f1e6;
  return String.fromCodePoint(base + code.charCodeAt(0) - 65, base + code.charCodeAt(1) - 65);
}

export function getCountryByCode(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export function countryName(country: Country, locale: string): string {
  return locale === "ar" ? country.nameAr : country.name;
}
