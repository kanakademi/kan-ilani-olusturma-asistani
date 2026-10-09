import { formatDateToTurkish } from "../utils/formUtils";

export const REGARDLESS_BLOOD_GROUP = "Kan Grubu Fark Etmeksizin";
export const MAX_BLOOD_GROUP_SELECTION = 4;

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