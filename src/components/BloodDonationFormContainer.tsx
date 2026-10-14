import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";
import "./BloodDonationFormContainer.css";
import { formatDateToTurkish, formatPhoneNumber, hashData } from "../utils/formUtils";
import { type DonationInfo, initialDonationInfo, REGARDLESS_BLOOD_GROUP, MAX_BLOOD_GROUP_SELECTION } from "../entities/DonationInfo";
import BloodDonationFormInputs from "./BloodDonationFormInputs";
import { getTemplateByIndex } from "../templates";

export default function BloodDonationFormContainer() {
  const { t, i18n } = useTranslation();
  const imageRef = useRef<HTMLDivElement | null>(null);

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [donationInfo, setDonationInfo] = useState<DonationInfo>(initialDonationInfo);
  const [showErrors, setShowErrors] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

  // 360×640 görsel kutusuna sığacak kadar küçültülür (masaüstü 1, telefonda üstte sabit alan ~0.55); indirilen görsel yine 1080×1920
  useLayoutEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setPreviewScale(Math.min(1, el.clientWidth / 360, el.clientHeight / 640)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const selectedTemplate = getTemplateByIndex(selectedTemplateIndex);
  const TemplateComponent = selectedTemplate?.Component;

  const handleDonationInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setDonationInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleBloodGroup = (group: string) => {
    setDonationInfo((prev) => {
      const current = prev.bloodGroup;
      let value: string[];
      if (current.includes(group)) value = current.filter((g) => g !== group);
      // "Fark etmeksizin" diğer gruplarla birlikte seçilemez; birini seçmek ötekini bırakır
      else if (group === REGARDLESS_BLOOD_GROUP) value = [group];
      else value = [...current.filter((g) => g !== REGARDLESS_BLOOD_GROUP), group];
      if (value.length > MAX_BLOOD_GROUP_SELECTION) return prev; // düğme zaten kapalı; koruma
      return { ...prev, bloodGroup: value };
    });
  };

  const setBloodType = (bloodType: string[]) => setDonationInfo((prev) => ({ ...prev, bloodType }));

  const handleDonationInfoPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setDonationInfo((prev) => ({
      ...prev,
      phone: formatted,
    }));
  };

  useEffect(() => {
    if (donationInfo.isRegularNeed) {
      setDonationInfo((prev) => ({
        ...prev,
        dateFormatted: buildRegularNeedDateString(formatDateToTurkish(prev.date)),
      }));
    }
    else {
      setDonationInfo((prev) => ({
        ...prev,
        dateFormatted: formatDateToTurkish(prev.date),
      }));
    }
  }, [i18n.language]);

  const handleDonationInfoDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setDonationInfo((prev) => ({
        ...prev,
        isRegularNeed: checked,
        dateFormatted: checked ? buildRegularNeedDateString(formatDateToTurkish(prev.date)) : formatDateToTurkish(prev.date),
      }));
    } else if (name === "date") {
      const formattedDate = formatDateToTurkish(value);
      setDonationInfo((prev) => ({
        ...prev,
        date: value,
        dateFormatted: prev.isRegularNeed ? buildRegularNeedDateString(formattedDate) : formattedDate,
      }));
    }
  };

  const buildRegularNeedDateString = (dateValue: string) => {
    const splitedFormattedDate = dateValue.split(" ");
    return `${splitedFormattedDate[1]} ${splitedFormattedDate[2]} (${t("regularNeedDate")})`;
  };

  const handleTemplateChange = (index: number) => {
    setSelectedTemplateIndex(index);
  };

  const downloadImage = async () => {
    setShowErrors(true);
    if (!imageRef.current) return;

    const fieldLabels: Record<keyof Omit<DonationInfo, "isRegularNeed" | "dateFormatted">, string> = {
      bloodGroup: t("bloodGroup"),
      bloodType: t("bloodType"),
      fullName: t("fullName"),
      phone: t("phone"),
      date: t("date"),
      hospital: t("hospitalName"),
      location: t("location"),
    };

    const missingFields: string[] = [];

    (Object.keys(fieldLabels) as Array<keyof typeof fieldLabels>).forEach((key) => {
      const val = donationInfo[key];
      const filled = Array.isArray(val)
        ? val.length > 0
        : typeof val === "string"
          ? val.trim() !== ""
          : val != null;
      if (!filled) missingFields.push(fieldLabels[key]);
    });

    if (missingFields.length > 0) {
      const nounKey = missingFields.length === 1 ? "fillAllFieldsSingleNoun" : "fillAllFieldsMultipleNoun";
      const noun = t(nounKey);

      Swal.fire({
        icon: "warning",
        confirmButtonText: t("close"),
        html: `${t("fillAllFields")
          .replace(/\n/g, "<br /><br />")
          .replace("{{missingFields}}", missingFields.join(", "))
          .replace("{{noun}}", noun)}`,
      });
      return;
    }

    if (donationInfo.phone.length < 11) {
      Swal.fire({
        icon: "warning",
        confirmButtonText: t("close"),
        html: t("phoneNumberInvalid").replace(/\n/g, "<br />"),
      });
      return;
    }

    try {
      const canvas = await html2canvas(imageRef.current, {
        scale: 3, // 360×640 → Instagram hikâyesi 1080×1920
        useCORS: true,
        // ekrandaki küçültme indirilen görsele geçmesin
        onclone: (doc) => {
          const preview = doc.querySelector<HTMLElement>(".onizleme__olcek");
          if (preview) preview.style.transform = "none";
          const box = doc.querySelector<HTMLElement>(".onizleme__kutu");
          if (box) box.style.overflow = "visible";
        },
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => resolve(result), "image/png");
      });

      if (!blob) {
        throw new Error("Canvas export failed");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "kan-bagis-ilani-formu.png";
      link.href = url;
      link.style.display = "none";
      link.target = "_blank";
      document.body.appendChild(link);

      const isMobile = /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);

      if (isMobile) {
        try {
          link.click();
        } catch {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      } else {
        link.click();
      }

      setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(url);
      }, 1500);

      updateCounter();
    } catch (error) {
      console.error("Image export failed", error);
      Swal.fire({
        icon: "error",
        confirmButtonText: t("close"),
        html: "İşlem sırasında bir hata oluştu.",
      });
    }
  };

  const updateCounter = () => {
    const href = typeof window !== "undefined" ? window.location.href : "";
    const path = typeof window !== "undefined" ? window.location.pathname : "";

    // Eğer URL "localhost" veya "/test" içeriyorsa isteği gönderme
    if (
      href.includes("localhost") ||
      href.includes("/test") ||
      path.includes("/test")
    ) {
      return;
    }

    const hash = hashData(donationInfo);
    fetch(import.meta.env.VITE_COUNTER_API, {
      body: JSON.stringify({ hash }),
      method: "POST",
    });
  };

  return (
    <div className="container">
      <BloodDonationFormInputs
        donationInfo={donationInfo}
        selectedTemplate={selectedTemplateIndex}
        showErrors={showErrors}
        handleDonationInfoChange={handleDonationInfoChange}
        toggleBloodGroup={toggleBloodGroup}
        setBloodType={setBloodType}
        handleDonationInfoPhoneChange={handleDonationInfoPhoneChange}
        handleDonationInfoDateChange={handleDonationInfoDateChange}
        handleTemplateChange={handleTemplateChange}
      />

      <aside className="onizleme" aria-label={t("preview")}>
        <div className="onizleme__baslik">{t("preview")}</div>
        <div className="onizleme__alan" ref={previewRef}>
          <div className="onizleme__kutu" style={{ width: 360 * previewScale, height: 640 * previewScale }}>
            <div className="onizleme__olcek" style={{ transform: `scale(${previewScale})` }}>
              {TemplateComponent && (
                <TemplateComponent
                  imageRef={imageRef}
                  donationInfo={donationInfo}
                />
              )}
            </div>
          </div>
        </div>
        {/* eski resim-düğme yerine klavye ve ekran okuyucuyla da çalışan gerçek düğme */}
        <button type="button" className="download-image-button" onClick={downloadImage}>
          {t("downloadButtonAlt")}
        </button>
      </aside>
    </div>
  );
}
