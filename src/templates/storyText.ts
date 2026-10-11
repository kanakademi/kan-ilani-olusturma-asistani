import { REGARDLESS_BLOOD_GROUP, type DonationInfo } from "../entities/DonationInfo";
import { splitBloodGroup } from "../utils/formUtils";

// Şablonların ortak metinleri
export function storyText(d: DonationInfo) {
  return {
    groups: d.bloodGroup.map(splitBloodGroup).filter((g) => g !== null),
    anyGroup: d.bloodGroup.includes(REGARDLESS_BLOOD_GROUP),
    types: Array.isArray(d.bloodType) ? d.bloodType : [String(d.bloodType)].filter(Boolean),
  };
}
