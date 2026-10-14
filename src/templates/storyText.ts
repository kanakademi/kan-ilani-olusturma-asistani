import { REGARDLESS_BLOOD_GROUP, type DonationInfo } from "../entities/DonationInfo";

// Şablonların ortak metinleri
export function storyText(d: DonationInfo) {
  return {
    groups: d.bloodGroup.filter((g) => g !== REGARDLESS_BLOOD_GROUP),
    anyGroup: d.bloodGroup.includes(REGARDLESS_BLOOD_GROUP),
    types: Array.isArray(d.bloodType) ? d.bloodType : [String(d.bloodType)].filter(Boolean),
  };
}
