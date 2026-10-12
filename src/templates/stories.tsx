import { useRef } from "react";
import type { TemplateProps } from "./types";
import type { DonationInfo } from "../entities/DonationInfo";
import { Brand, Groups } from "./parts";
import { storyText } from "./storyText";
import { useFitText } from "../utils/useFitText";
import "./stories.css";

/*
 * Instagram hikâyesi (9:16): ekranda 360×640 çizilir, html2canvas 3× ölçekle 1080×1920 indirir.
 * Eski Kan Akademi kartlarının düzeni: bilgi önce, süs yok. Bakan kişi birkaç saniyede "kime, nereye, kimi arayacağım"ı görür;
 * altta bağıştan önce iletişim uyarısı. Tek yerleşim, üç renk; kan grubu çerçeveli kutuda, okunur ama afiş kadar dev değil.
 */

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="il-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Centers({ text }: { text: string }) {
  const ref = useRef<HTMLElement | null>(null);
  useFitText(ref, 12.5, text);
  return (
    <section className="il-centers" ref={ref}>
      <h3>Kan bağışının yapılabileceği merkezler</h3>
      <p data-fit>{text}</p>
    </section>
  );
}

function Ilan({ d, imageRef, tema }: { d: DonationInfo; imageRef: TemplateProps["imageRef"]; tema: string }) {
  const { types } = storyText(d);
  return (
    <div className={`st il il--${tema}`} ref={imageRef}>
      <header className="il-band">
        <Brand />
      </header>
      <div className="il-body">
        <section className="il-group">
          <span className="il-kicker">Kan ihtiyacı</span>
          <Groups d={d} />
        </section>
        <dl className="il-rows">
          <Row label="Bağış türü" value={types.join(", ")} />
          <Row label="Hasta" value={d.fullName} />
          <Row label="Hastane" value={d.hospital} />
          <Row label="Tarih" value={d.dateFormatted} />
          <Row label="İletişim" value={d.phone} />
        </dl>
        <Centers text={d.location} />
      </div>
      <footer className="il-foot">
        <strong>Kan bağışından önce ilgili kişiyle iletişime geçiniz!</strong>
        <span>Bağış yapamıyorsan paylaş · kanakademi.com.tr</span>
      </footer>
    </div>
  );
}

export const KlasikStory = ({ donationInfo, imageRef }: TemplateProps) => <Ilan d={donationInfo} imageRef={imageRef} tema="klasik" />;
export const GeceStory = ({ donationInfo, imageRef }: TemplateProps) => <Ilan d={donationInfo} imageRef={imageRef} tema="gece" />;
export const SicakStory = ({ donationInfo, imageRef }: TemplateProps) => <Ilan d={donationInfo} imageRef={imageRef} tema="sicak" />;
