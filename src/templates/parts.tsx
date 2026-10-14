import type { ReactNode } from "react";
import type { DonationInfo } from "../entities/DonationInfo";
import { storyText } from "./storyText";
import { capsTR } from "../utils/formUtils";

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

const DROP = "M50 2C50 2 6 58 6 90a44 44 0 0 0 88 0C94 58 50 2 50 2Z";

// Kan damlası; `stops` verilirse dikey/çapraz gradyanla boyanır
export function Drop({ id, fill, stops, className }: { id: string; fill?: string; stops?: string[]; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 136" aria-hidden="true">
      {stops && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            {stops.map((c, i) => (
              <stop key={c + i} offset={i / (stops.length - 1)} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
      )}
      <path d={DROP} fill={stops ? `url(#${id})` : fill} />
    </svg>
  );
}

export function Brand({ className }: { className?: string }) {
  return (
    <span className={`st-brand ${className ?? ""}`}>
      <span className="st-brand__logo">
        <img src="./assets/images/kan-akademi-logo.png" alt="" />
      </span>
      Kan Akademi
    </span>
  );
}

// Görselin ana öğesi: tek kan grubu, sitede kullanılan "A RH (-)" yazımıyla; boyu stories.tsx alana göre ayarlar
export function Groups({ d }: { d: DonationInfo }) {
  const { groups, anyGroup } = storyText(d);
  if (anyGroup)
    return (
      <div className="st-groups st-groups--any" data-fit>
        <span>Kan Grubu</span>
        <span>Fark Etmeksizin</span>
      </div>
    );
  return (
    <div className="st-groups" data-fit>
      {groups[0]}
    </div>
  );
}

export function Chips({ d, className }: { d: DonationInfo; className?: string }) {
  return (
    <span className={`st-chips ${className ?? ""}`}>
      {storyText(d).types.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </span>
  );
}

// İkonlu bilgi satırı: ikon kutusu + küçük etiket + değer
export function Field({ icon, label, value, ink }: { icon: keyof typeof PATHS; label: string; value: string; ink: string }) {
  return (
    <div className="st-field">
      <span className="st-field__icon">
        <Icon name={icon} color={ink} />
      </span>
      <span className="st-field__text">
        <span className="st-label">{capsTR(label)}</span>
        <span className="st-value">{value}</span>
      </span>
    </div>
  );
}
