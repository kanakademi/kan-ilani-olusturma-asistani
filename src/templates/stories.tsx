import { useRef } from "react";
import type { TemplateProps } from "./types";
import type { DonationInfo } from "../entities/DonationInfo";
import { Brand, Groups, Icon } from "./parts";
import { storyText } from "./storyText";
import { useFitText } from "../utils/useFitText";
import "./stories.css";

/*
 * Instagram hikâyesi (9:16): ekranda 360×640 çizilir, html2canvas 3× ölçekle 1080×1920 indirir.
 * Sade, tek vurgu renkli şablonlar: bir ihtiyaç ilanı afiş değildir (geri bildirim: "neden bu kadar renkli").
 * Üstte ~88px (profil adı, ilerleme çubuğu) ve altta ~96px (Mesaj gönder kutusu) Instagram'ın kapattığı alan:
 * marka ve iletişim uyarısı bu boşlukların arasında kalır.
 */

type IconName = Parameters<typeof Icon>[0]["name"];

function Row({ icon, label, value, ink }: { icon: IconName; label: string; value: string; ink: string }) {
  return (
    <div className="il-row">
      <Icon name={icon} color={ink} size={16} />
      <p>
        <b>{label}:</b> {value}
      </p>
    </div>
  );
}

function Centers({ text, ink }: { text: string; ink: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useFitText(ref, 13, text);
  return (
    <div className="il-row il-centers" ref={ref}>
      <Icon name="pin" color={ink} size={16} />
      <div>
        <p>
          <b>Kan bağışının yapılabileceği merkezler:</b>
        </p>
        <p data-fit>{text}</p>
      </div>
    </div>
  );
}

// html2canvas SVG ikonunu ayrı resim olarak çizer: CSS değişkeni çözülmez, renk açıkça verilir
const IKON: Record<string, string> = { acik: "#c8102e", koyu: "#ff4d55", lacivert: "#ff4d55" };

function Ilan({ d, imageRef, tema }: { d: DonationInfo; imageRef: TemplateProps["imageRef"]; tema: string }) {
  const { types } = storyText(d);
  const ink = IKON[tema];
  return (
    <div className={`st il il--${tema}`} ref={imageRef}>
      <div className="il-ic">
        <Brand />
        <Groups d={d} />
        <div className="il-body">
          <Row icon="drop" label="Bağış Türü" value={types.join(", ")} ink={ink} />
          <Row icon="calendar" label="Tarih" value={d.dateFormatted} ink={ink} />
          <Row icon="phone" label="Telefon" value={d.phone} ink={ink} />
          <Row icon="user" label="Hasta Adı" value={d.fullName} ink={ink} />
          <Row icon="hospital" label="Hastane Adı" value={d.hospital} ink={ink} />
          <Centers text={d.location} ink={ink} />
        </div>
        <p className="il-uyari">Kan bağışından önce ilgili kişiyle iletişime geçiniz!</p>
      </div>
    </div>
  );
}

const sablon = (tema: string) => {
  const S = ({ donationInfo, imageRef }: TemplateProps) => <Ilan d={donationInfo} imageRef={imageRef} tema={tema} />;
  return S;
};
export const AcikStory = sablon("acik");
export const KoyuStory = sablon("koyu");
export const LacivertStory = sablon("lacivert");
