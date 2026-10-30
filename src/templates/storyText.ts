import { BLOOD_TYPES, REGARDLESS_BLOOD_GROUP, type DonationInfo } from "../entities/DonationInfo";

/** ilan görselinin dili: arayüz dilinden bağımsız seçilebilir (Türkiye'deki yabancı, ilanı Türkçe dağıtmak isteyebilir) */
export type GorselDil = "tr" | "en";

// Görseldeki sabit yazılar. Türkçe olanlar önceki görselle birebir aynı.
const YAZI = {
  tr: {
    bagisTuru: "Bağış Türü",
    hasta: "Hasta Adı",
    telefon: "Telefon",
    tarih: "Tarih",
    hastane: "Hastane Adı",
    merkezler: "Kan bağışının yapılabileceği merkezler:",
    uyari: "Kan bağışından önce ilgili kişiyle iletişime geçiniz!",
    herGrup: ["Kan Grubu", "Fark Etmeksizin"],
  },
  en: {
    bagisTuru: "Donation Type",
    hasta: "Patient",
    telefon: "Phone",
    tarih: "Date",
    hastane: "Hospital",
    merkezler: "Where you can donate:",
    uyari: "Please contact the person above before donating!",
    herGrup: ["Any", "Blood Group"],
  },
} as const;

const TUR_EN: Record<string, string> = {
  redBlood: "Red Blood Cells",
  platelet: "Platelets",
  granulocyte: "Granulocytes",
  plasma: "Plasma",
  stemCell: "Stem Cells",
};
const TUR_ANAHTAR: Record<string, string> = Object.fromEntries(BLOOD_TYPES);

/** İngilizce tarih: "12 March 2026", düzenli ihtiyaçta "March 2026 (regular need)" */
export function tarihEn(d: DonationInfo): string {
  const t = new Date(d.date);
  if (Number.isNaN(t.valueOf())) return d.dateFormatted;
  if (d.isRegularNeed) return `${t.toLocaleDateString("en-GB", { month: "long", year: "numeric" })} (regular need)`;
  return t.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// Şablonların ortak metinleri
export function storyText(d: DonationInfo, dil: GorselDil = "tr") {
  const types = Array.isArray(d.bloodType) ? d.bloodType : [String(d.bloodType)].filter(Boolean);
  return {
    groups: d.bloodGroup.filter((g) => g !== REGARDLESS_BLOOD_GROUP),
    anyGroup: d.bloodGroup.includes(REGARDLESS_BLOOD_GROUP),
    types: dil === "en" ? types.map((v) => TUR_EN[TUR_ANAHTAR[v]] ?? v) : types,
    tarih: dil === "en" ? tarihEn(d) : d.dateFormatted,
    yazi: YAZI[dil],
  };
}
