import { useRef } from "react";
import type { TemplateProps } from "./types";
import type { DonationInfo } from "../entities/DonationInfo";
import { Brand, Chips, Drop, Field, Groups, Icon } from "./parts";
import { capsTR } from "../utils/formUtils";
import { useFitText } from "../utils/useFitText";
import "./stories.css";

/*
 * Instagram hikâyesi (9:16): ekranda 360×640 çizilir, html2canvas 3× ölçekle 1080×1920 indirir.
 * Görselin ana öğesi kan grubu; diğer bilgiler eşit ağırlıkta, onun altında.
 * Üst ~40px ve alt ~30px'e kritik bilgi konmaz; Instagram'ın profil satırı ve yanıt kutusu oraya biner.
 */

function Details({ d, ink }: { d: DonationInfo; ink: string }) {
  return (
    <>
      <Field icon="user" label="Hasta" value={d.fullName} ink={ink} />
      <Field icon="hospital" label="Hastane" value={d.hospital} ink={ink} />
      <div className="st-row2">
        <Field icon="calendar" label="Tarih" value={d.dateFormatted} ink={ink} />
        <Field icon="phone" label="İletişim" value={d.phone} ink={ink} />
      </div>
    </>
  );
}

function Centers({ text, ink }: { text: string; ink: string }) {
  const ref = useRef<HTMLElement | null>(null);
  useFitText(ref, 12, text);
  return (
    <section className="st-centers" ref={ref}>
      <span className="st-label st-centers__label">
        <Icon name="pin" color={ink} size={13} />
        {capsTR("Bağış yapılabilecek yerler")}
      </span>
      <p data-fit>{text}</p>
    </section>
  );
}

function Foot() {
  return (
    <footer className="st-foot">
      <span>Bağış yapamıyorsan paylaş</span>
      <span>kanakademi.com.tr</span>
    </footer>
  );
}

/* 1 — Damla: kırmızı üst yarıda dev beyaz kan grubu, yumuşak kavisle beyaz bilgi alanına geçer */
export function DamlaStory({ donationInfo: d, imageRef }: TemplateProps) {
  return (
    <div className="st st-damla" ref={imageRef}>
      <header className="st-damla__head">
        <Drop id="damla-dekor" fill="#fff" className="st-damla__decor" />
        <Brand />
        <Groups d={d} />
        <Chips d={d} />
        <span className="st-damla__arc" />
      </header>
      <div className="st-damla__body">
        <Details d={d} ink="#d3172a" />
        <Centers text={d.location} ink="#d3172a" />
        <Foot />
      </div>
    </div>
  );
}

/* 2 — Gece: sitenin gece mavisi, kırmızı kan grubu, cam paneller */
export function GeceStory({ donationInfo: d, imageRef }: TemplateProps) {
  return (
    <div className="st st-gece" ref={imageRef}>
      <Drop id="gece-dekor" stops={["#e3262f", "#9b3bb5", "#1ba6df"]} className="st-gece__decor" />
      <Brand />
      <div className="st-gece__hero">
        <Groups d={d} />
        <Chips d={d} />
      </div>
      <div className="st-panel">
        <Details d={d} ink="#7fd3f5" />
      </div>
      <div className="st-panel st-panel--grow">
        <Centers text={d.location} ink="#7fd3f5" />
      </div>
      <Foot />
    </div>
  );
}

/* 3 — Bilet: kırmızı desenli zeminde bilet; üst koçanda kan grubu, delikli çizginin altında bilgiler */
export function BiletStory({ donationInfo: d, imageRef }: TemplateProps) {
  return (
    <div className="st st-bilet" ref={imageRef}>
      <svg className="st-bilet__pattern" width="360" height="640" aria-hidden="true">
        <defs>
          <pattern id="bilet-desen" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M18 8c0 0-5 6.5-5 10a5 5 0 0 0 10 0c0-3.5-5-10-5-10z" fill="#fff" opacity="0.09" />
          </pattern>
        </defs>
        <rect width="360" height="640" fill="url(#bilet-desen)" />
      </svg>
      <Brand />
      <div className="st-bilet__ticket">
        <div className="st-bilet__stub">
          <Groups d={d} />
          <Chips d={d} />
        </div>
        <div className="st-bilet__cut" />
        <div className="st-bilet__bottom">
          <Details d={d} ink="#d3172a" />
          <Centers text={d.location} ink="#d3172a" />
        </div>
      </div>
      <Foot />
    </div>
  );
}

/* 4 — Şeftali: açık, sıcak, ortalanmış; dev kırmızı kan grubu ve beyaz bilgi kartı */
export function SeftaliStory({ donationInfo: d, imageRef }: TemplateProps) {
  return (
    <div className="st st-seftali" ref={imageRef}>
      <span className="st-seftali__blob st-seftali__blob--1" />
      <span className="st-seftali__blob st-seftali__blob--2" />
      <Brand />
      <div className="st-seftali__hero">
        <Groups d={d} />
        <Chips d={d} />
      </div>
      <div className="st-card">
        <Details d={d} ink="#d3172a" />
      </div>
      <Centers text={d.location} ink="#d3172a" />
      <Foot />
    </div>
  );
}
