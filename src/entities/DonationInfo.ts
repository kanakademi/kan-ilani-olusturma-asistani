import { formatDateToTurkish } from "../utils/formUtils";

export const REGARDLESS_BLOOD_GROUP = "Kan Grubu Fark Etmeksizin";
export const MAX_BLOOD_GROUP_SELECTION = 4;
// telefon maskeli tutulur ("0532 123 45 67"); indirme için en az bu uzunluk
export const MIN_PHONE_LENGTH = 11;

export interface DonationInfo {
  bloodGroup: string[]; // en fazla 4 grup ya da yalnızca REGARDLESS_BLOOD_GROUP
  bloodType: string[]
  fullName: string;
  phone: string;
  date: string;
  dateFormatted: string;
  isRegularNeed: boolean;
  hospital: string;
  location: string;
}

// indirme için zorunlu alanlar (sıra, uyarı mesajında kullanılır)
export const REQUIRED_FIELDS = ["bloodGroup", "bloodType", "fullName", "phone", "date", "hospital", "location"] as const;
export type RequiredField = (typeof REQUIRED_FIELDS)[number];

export function missingRequiredFields(info: DonationInfo): RequiredField[] {
  return REQUIRED_FIELDS.filter((f) => {
    const v = info[f];
    return Array.isArray(v) ? v.length === 0 : v.trim() === "";
  });
}

// "Galerine kaydet" ipucu ve indirme aynı kuralı kullanır (PR #46): ipucu görünüp indirmede uyarı çıkmasın
export function isDonationInfoComplete(info: DonationInfo): boolean {
  return missingRequiredFields(info).length === 0 && info.phone.length >= MIN_PHONE_LENGTH;
}

export const initialDonationInfo: DonationInfo = {
  bloodGroup: [],
  bloodType: [],
  fullName: "",
  phone: "",
  date: new Date().toLocaleDateString("en-CA"),
  dateFormatted: formatDateToTurkish(new Date().toLocaleDateString("en-CA")),
  isRegularNeed: false,
  hospital: "",
  location: "",
};