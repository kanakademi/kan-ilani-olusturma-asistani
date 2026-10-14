import { useRef, type ReactNode } from "react";
import type { TemplateProps } from "./types";
import type { DonationInfo } from "../entities/DonationInfo";
import { Brand, Groups, Icon } from "./parts";
import { storyText } from "./storyText";
import { useFitText } from "../utils/useFitText";
import "./stories.css";

/*
 * Instagram hikâyesi (9:16): ekranda 360×640 çizilir, html2canvas 3× ölçekle 1080×1920 indirir.
 * Eski Kan Akademi uygulamasının altı şablonu (koyu, pembe, nane, retro, turuncu, beyaz damla) aynı düzen ve renklerle,
 * PNG arka plan yerine CSS + vektörle: her çözünürlükte net, yazı alanları içeriğe göre uzar.
 * Ortak iskelet: üst bant, kan grubu alanı, "Bağış türü/Tarih/Telefon", "Hasta/Hastane/Merkezler", alt uyarı bandı.
 * Süsler kartın tamamını kaplayan tek SVG'de (360×640 koordinat), yazıların arkasında.
 * Instagram üstte profil adını, altta "Mesaj gönder" kutusunu kartın üstüne çizer: üst bant 100px, alt bant 110px;
 * "Kan Akademi" bandın altında, uyarı bandın üstünde kalır, eski oranlar arada korunur.
 */

type IconName = Parameters<typeof Icon>[0]["name"];

function Row({ icon, label, value, ink }: { icon: IconName; label: string; value: string; ink: string }) {
  return (
    <div className="il-row">
      <p>
        <b>{label}:</b> {value}
      </p>
      <span className="il-ikon">
        <Icon name={icon} color={ink} size={18} />
      </span>
    </div>
  );
}

function Centers({ text, ink }: { text: string; ink: string }) {
  return (
    <div className="il-row il-centers">
      <p>
        <b>Kan bağışının yapılabileceği merkezler:</b>
      </p>
      <p>{text}</p>
      <span className="il-ikon">
        <Icon name="pin" color={ink} size={18} />
      </span>
    </div>
  );
}

// html2canvas SVG ikonunu ayrı resim olarak çizer: CSS değişkeni çözülmez, renk açıkça verilir (ikon yalnızca koyu şablonda görünür)
const IKON: Record<string, string> = { gece: "#232126" };

const DROP = "M50 2C50 2 6 58 6 90a44 44 0 0 0 88 0C94 58 50 2 50 2Z";

// Her şablonun süsü; koordinatlar kartın 360×640 düzeninde (üst bant 0–100, kan grubu alanı 100–228, alt bant 530'dan sonra)
const SUSLER: Record<string, ReactNode> = {
  pembe: (
    <g transform="translate(360 228) scale(0.76) translate(-360 -180)">
      {/* kan torbası, hortum sağ kenardan aşağı inip kalp düğümüyle kola bağlanır */}
      <path d="M318 196 C318 182 350 180 350 206 L350 520 C350 548 322 552 322 534 C322 520 342 520 342 536 C342 560 318 566 300 560" fill="none" stroke="#ff4550" strokeWidth="2" />
      <g transform="translate(272 190)">
        <rect x="16" y="0" width="7" height="22" rx="2" fill="#ff4550" stroke="#1a1730" strokeWidth="1.6" />
        <rect x="41" y="0" width="7" height="22" rx="2" fill="#ff4550" stroke="#1a1730" strokeWidth="1.6" />
        <rect x="12" y="20" width="40" height="9" rx="3" fill="#fff" stroke="#1a1730" strokeWidth="1.6" />
        <path d="M8 34 Q8 29 13 29 L51 29 Q56 29 56 34 L56 92 Q56 98 50 98 L14 98 Q8 98 8 92 Z" fill="#fff" stroke="#1a1730" strokeWidth="1.8" />
        <rect x="13" y="42" width="38" height="51" rx="4" fill="#ff4550" />
        <rect x="28" y="56" width="8" height="22" rx="1.5" fill="#fff" />
        <rect x="21" y="63" width="22" height="8" rx="1.5" fill="#fff" />
      </g>
      {/* kalbi tutan el */}
      <g transform="translate(34 0)" fill="#fff" stroke="#1a1730" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M244 576 L247 498 M276 576 L273 498" fill="none" />
        <path d="M247 498 C232 486 226 468 234 452 L246 440 L276 446 L284 470 C284 484 280 492 273 498" />
        <path d="M262 470 C246 456 232 448 232 434 C232 424 240 418 248 418 C254 418 258 422 262 426 C266 422 270 418 276 418 C284 418 292 424 292 434 C292 448 278 456 262 470 Z" fill="#ff4550" stroke="none" />
        <rect x="258" y="430" width="8" height="22" rx="1.5" fill="#fff" stroke="none" />
        <rect x="251" y="437" width="22" height="8" rx="1.5" fill="#fff" stroke="none" />
        <rect x="270" y="416" width="11" height="30" rx="5.5" transform="rotate(14 275 431)" />
        <rect x="282" y="424" width="11" height="28" rx="5.5" transform="rotate(26 287 438)" />
        <rect x="289" y="438" width="10" height="22" rx="5" transform="rotate(40 294 449)" />
        <path d="M234 452 C226 446 224 436 230 430" fill="none" />
        <path d="M254 548 L266 548" strokeWidth="5" />
        <path d="M252 538 L246 532 M268 538 L274 532 M260 536 L260 528" fill="none" strokeWidth="1.6" />
      </g>
      <ellipse cx="294" cy="560" rx="10" ry="4" fill="#ffc6cf" />
    </g>
  ),
  nane: (
    <g transform="translate(266 242) scale(0.66)">
      <path d={DROP} fill="#ffd3de" transform="translate(-12 6)" />
      <path d={DROP} fill="#ffe4eb" fillOpacity="0.8" stroke="#f43f6e" strokeWidth="7" strokeLinejoin="round" />
      <path d="M30 92 C30 108 40 116 56 116" fill="none" stroke="#f43f6e" strokeWidth="7" strokeLinecap="round" />
    </g>
  ),
  retro: (
    <>
      <defs>
        <pattern id="il-izgara" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 0H0V12" fill="none" stroke="#1a1730" strokeOpacity="0.22" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="228" width="360" height="151" fill="#f74e47" />
      <rect x="0" y="379" width="360" height="151" fill="#1f6fbf" />
      <rect x="180" y="228" width="180" height="151" fill="#1f6fbf" />
      <rect x="180" y="379" width="180" height="151" fill="#f74e47" />
      <rect x="0" y="228" width="360" height="302" fill="url(#il-izgara)" />
    </>
  ),
  // 6 · Beyaz: sağ kenardan inen büyük pembe damla (eski şablon 6)
  damla: <path d="M360 226 L266 392 C252 418 246 444 246 468 C246 536 298 588 360 600 Z" fill="#e87a87" />,
};

function Ilan({ d, imageRef, tema }: { d: DonationInfo; imageRef: TemplateProps["imageRef"]; tema: string }) {
  const { types } = storyText(d);
  const ink = IKON[tema] ?? "#1a1730";
  // uzun ad/hastane/merkez yazılınca bütün bilgi satırları birlikte küçülür; hiçbir satır kaybolmaz
  const bodyRef = useRef<HTMLDivElement | null>(null);
  useFitText(bodyRef, 14, tema + JSON.stringify(d));
  return (
    <div className={`st il il--${tema}`} ref={imageRef}>
      {SUSLER[tema] && (
        <svg className="il-sus" viewBox="0 0 360 640" aria-hidden="true">
          {SUSLER[tema]}
        </svg>
      )}
      <header className="il-band">
        <Brand />
      </header>
      <section className="il-top">
        <Groups d={d} />
      </section>
      <div className="il-body" ref={bodyRef}>
        <div className="il-fit" data-fit>
        {/* eski şablonlardaki sıra: koyu şablonda hasta adı ikinci, ötekilerde bağış türü/tarih/telefon önce */}
        {tema === "gece" ? (
          <>
            <div className="il-a">
              <Row icon="drop" label="Bağış Türü" value={types.join(", ")} ink={ink} />
              <Row icon="user" label="Hasta Adı" value={d.fullName} ink={ink} />
              <Row icon="phone" label="Telefon" value={d.phone} ink={ink} />
              <Row icon="calendar" label="Tarih" value={d.dateFormatted} ink={ink} />
              <Row icon="hospital" label="Hastane Adı" value={d.hospital} ink={ink} />
            </div>
            <div className="il-b">
              <Centers text={d.location} ink={ink} />
            </div>
          </>
        ) : (
          <>
            <div className="il-a">
              <Row icon="drop" label="Bağış Türü" value={types.join(", ")} ink={ink} />
              <Row icon="calendar" label="Tarih" value={d.dateFormatted} ink={ink} />
              <Row icon="phone" label="Telefon" value={d.phone} ink={ink} />
            </div>
            <div className="il-b">
              <Row icon="user" label="Hasta Adı" value={d.fullName} ink={ink} />
              <Row icon="hospital" label="Hastane Adı" value={d.hospital} ink={ink} />
              <Centers text={d.location} ink={ink} />
            </div>
          </>
        )}
        </div>
      </div>
      <footer className="il-foot">Kan bağışından önce ilgili kişiyle iletişime geçiniz!</footer>
    </div>
  );
}

const sablon = (tema: string) => {
  const S = ({ donationInfo, imageRef }: TemplateProps) => <Ilan d={donationInfo} imageRef={imageRef} tema={tema} />;
  return S;
};
export const GeceStory = sablon("gece");
export const PembeStory = sablon("pembe");
export const NaneStory = sablon("nane");
export const RetroStory = sablon("retro");
export const TuruncuStory = sablon("turuncu");
export const DamlaStory = sablon("damla");
