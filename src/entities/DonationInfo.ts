import { formatDateToTurkish } from "../utils/formUtils";

export const REGARDLESS_BLOOD_GROUP = "Kan Grubu Fark Etmeksizin";

export interface DonationInfo {
  bloodGroup: string[]; // tek öğe: bir grup ya da REGARDLESS_BLOOD_GROUP
  bloodType: string[]
  fullName: string;
  phone: string;
  date: string;
  dateFormatted: string;
  isRegularNeed: boolean;
  hospital: string;
  location: string;
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