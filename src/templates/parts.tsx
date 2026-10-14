import type { ReactNode } from "react";
import type { DonationInfo } from "../entities/DonationInfo";
import { storyText } from "./storyText";

// html2canvas SVG'yi ayrı resim olarak çizer: currentColor miras alınmaz, renk açıkça verilmeli
const PATHS: Record<string, ReactNode> = {
  drop: <path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </>
  ),
  hospital: (
    <>
      <path d="M5 21V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16" />
      <path d="M12 8v6M9 11h6M3 21h18" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  phone: <path d="M5 3h3.5l2 5-2.6 1.6a12 12 0 0 0 6.5 6.5L16 13.5l5 2V19a2 2 0 0 1-2 2C10.2 21 3 13.8 3 5a2 2 0 0 1 2-2z" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
};

export function Icon({ name, color, size = 17 }: { name: keyof typeof PATHS; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

export function Brand() {
  return (
    <span className="st-brand">
      <span className="st-brand__logo">
        <img src="./assets/images/kan-akademi-logo.png" alt="" />
      </span>
      Kan Akademi
    </span>
  );
}

// Görselin ana öğesi: sitede kullanılan "A RH (-)" yazımı, tek boyda; 1 grup dev, 2 grup alt alta, 3–4 grup 2×2
export function Groups({ d }: { d: DonationInfo }) {
  const { groups, anyGroup } = storyText(d);
  if (anyGroup) return <div className="st-groups st-groups--any">Kan Grubu Fark Etmeksizin</div>;
  const cells = groups.length ? groups : ["?"];
  return (
    <div className={`st-groups st-groups--n${cells.length}`}>
      {cells.map((g) => (
        <span key={g}>{g}</span>
      ))}
    </div>
  );
}
