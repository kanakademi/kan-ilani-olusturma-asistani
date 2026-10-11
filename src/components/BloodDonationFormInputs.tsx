import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import LabeledTextField from "./LabeledTextField";
import { Checkbox, FormControlLabel, IconButton } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import Swal from "sweetalert2";
import { type DonationInfo, REGARDLESS_BLOOD_GROUP, MAX_BLOOD_GROUP_SELECTION } from "../entities/DonationInfo";
import { getTemplateList } from "../templates";

const BLOOD_GROUPS = ["A RH (+)", "A RH (-)", "B RH (+)", "B RH (-)", "AB RH (+)", "AB RH (-)", "0 RH (+)", "0 RH (-)"];
// değer görsele Türkçe yazılır, etiket seçili dilde gösterilir
const BLOOD_TYPES = [
  ["Kırmızı Kan", "redBlood"],
  ["Trombosit", "platelet"],
  ["Granülosit", "granulocyte"],
  ["Plazma", "plasma"],
  ["Kök Hücre", "stemCell"],
] as const;

interface InputProps {
  donationInfo: DonationInfo;
  selectedTemplate: number;
  showErrors: boolean;
  handleDonationInfoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  toggleBloodGroup: (group: string) => void;
  toggleBloodType: (type: string) => void;
  handleDonationInfoPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDonationInfoDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTemplateChange: (index: number) => void;
}

function Section({ no, title, children }: { no: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="bolum">
      <legend className="bolum__baslik">
        <span className="bolum__no">{String(no).padStart(2, "0")}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export default function BloodDonationFormInputs(props: InputProps) {
  const { t } = useTranslation();
  const { donationInfo: d, showErrors } = props;

  const isEmpty = (val: string) => val.trim().length === 0;
  const hasRegardless = d.bloodGroup.includes(REGARDLESS_BLOOD_GROUP);
  // sınıra ulaşınca seçili olanlar tıklanabilir kalır ki biri bırakılıp başkası seçilebilsin
  const limitReached = d.bloodGroup.length >= MAX_BLOOD_GROUP_SELECTION;

  const bloodGroupError = showErrors && d.bloodGroup.length === 0;
  const bloodTypeError = showErrors && d.bloodType.length === 0;
  const fullNameError = showErrors && isEmpty(d.fullName);
  const phoneError = showErrors && isEmpty(d.phone);
  const dateError = showErrors && isEmpty(d.date);
  const hospitalError = showErrors && isEmpty(d.hospital);
  const locationError = showErrors && isEmpty(d.location);

  const handleInfoClick = () => {
    Swal.fire({
      html: `
          <!DOCTYPE html>
          <html lang="tr">
          <head>
              <meta charset="UTF-8">
              <style>
                  .logo { width: 80px; margin-bottom: 20px; }
                  .containerr { background-color: #eeebe3; text-align: center; }
                  .main-title { font-size: 2em; font-weight: bold; margin: 10px 0; }
              </style>
          </head>
          <body>
            <div class="containerr">
              <img class="logo" src="./assets/images/kan-akademi-logo.png" alt="Kan Akademi Logo" />
              <div class="main-title">${t("regularNeedInfoTitle")}</div>
              <div>${t("regularNeedInfoContent").replace(/\n/g, "<br /><br />")}</div>
            </div>
          </body>
          </html>
        `,
      showConfirmButton: true,
      confirmButtonText: t("close"),
      background: "#eeebe3",
    });
  };

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <Section no={1} title={t("sectionNeed")}>
        <div className="secim-baslik" id="kan-grubu">{t("bloodGroup")}</div>
        <div className="secim secim--4" role="group" aria-labelledby="kan-grubu">
          {BLOOD_GROUPS.map((group) => {
            const selected = d.bloodGroup.includes(group);
            return (
              <button
                key={group}
                type="button"
                className="secim__dugme"
                aria-pressed={selected}
                disabled={limitReached && !selected}
                onClick={() => props.toggleBloodGroup(group)}
              >
                {group.replace(" RH (", " Rh").replace(")", "")}
              </button>
            );
          })}
          <button
            type="button"
            className="secim__dugme secim__dugme--genis"
            aria-pressed={hasRegardless}
            onClick={() => props.toggleBloodGroup(REGARDLESS_BLOOD_GROUP)}
          >
            {t("regardlessOfBloodType")}
          </button>
        </div>
        <p className={bloodGroupError ? "secim-not secim-not--hata" : "secim-not"}>
          {bloodGroupError ? t("requiredText") : t("maxGroupsHint", { max: MAX_BLOOD_GROUP_SELECTION })}
        </p>

        <div className="secim-baslik" id="kan-turu">{t("bloodType")}</div>
        <div className="secim secim--sar" role="group" aria-labelledby="kan-turu">
          {BLOOD_TYPES.map(([value, key]) => (
            <button
              key={value}
              type="button"
              className="secim__dugme"
              aria-pressed={d.bloodType.includes(value)}
              onClick={() => props.toggleBloodType(value)}
            >
              {t(key)}
            </button>
          ))}
        </div>
        {bloodTypeError && <p className="secim-not secim-not--hata">{t("requiredText")}</p>}
      </Section>

      <Section no={2} title={t("sectionPatient")}>
        <LabeledTextField
          label={t("fullName")}
          name="fullName"
          slotProps={{ htmlInput: { maxLength: 39 } }}
          value={d.fullName}
          onChange={props.handleDonationInfoChange}
          error={fullNameError}
          helperText={fullNameError ? t("requiredText") : ""}
        />
        <LabeledTextField
          type="tel"
          label={t("phone")}
          name="phone"
          slotProps={{ htmlInput: { inputMode: "tel" } }}
          value={d.phone}
          onChange={props.handleDonationInfoPhoneChange}
          error={phoneError}
          helperText={phoneError ? t("requiredText") : ""}
        />
      </Section>

      <Section no={3} title={t("sectionPlace")}>
        {/* dar telefonda "Düzenli İhtiyaç" tarihin altına iner; yoksa sayfa yana taşıyordu */}
        <div className="tarih-satiri">
          <div className="tarih-satiri__tarih">
            <LabeledTextField
              type="date"
              name="date"
              label={t("date")}
              value={d.date}
              onChange={props.handleDonationInfoDateChange}
              error={dateError}
              helperText={dateError ? t("requiredText") : ""}
            />
          </div>
          <div className="tarih-satiri__duzenli">
            <FormControlLabel
              name="regularNeedDate"
              label={t("regularNeedDate")}
              sx={{ whiteSpace: "nowrap", mr: 0 }}
              control={<Checkbox checked={d.isRegularNeed} onChange={props.handleDonationInfoDateChange} />}
            />
            <IconButton size="small" title={t("regularNeedInfoButton")} aria-label={t("regularNeedInfoButton")} onClick={handleInfoClick}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </div>
        </div>
        <LabeledTextField
          label={t("hospitalName")}
          name="hospital"
          slotProps={{ htmlInput: { maxLength: 84 } }}
          value={d.hospital}
          onChange={props.handleDonationInfoChange}
          multiline
          minRows={2}
          error={hospitalError}
          helperText={hospitalError ? t("requiredText") : ""}
        />
        <LabeledTextField
          label={t("location")}
          name="location"
          slotProps={{ htmlInput: { maxLength: 330 } }}
          value={d.location}
          onChange={props.handleDonationInfoChange}
          multiline
          minRows={4}
          error={locationError}
          helperText={locationError ? t("requiredText") : `${d.location.length}/330`}
        />
      </Section>

      <Section no={4} title={t("sectionTemplate")}>
        <div className="sablonlar" role="group" aria-label={t("templateSelection")}>
          {getTemplateList().map((template, index) => (
            <button
              type="button"
              key={template.id}
              className="sablon"
              aria-pressed={props.selectedTemplate === index}
              onClick={() => props.handleTemplateChange(index)}
            >
              <span className="sablon__renk" style={{ background: template.selectorColor, color: template.selectorInk }} aria-hidden="true">
                {index + 1}
              </span>
              {template.name}
            </button>
          ))}
        </div>
      </Section>
    </form>
  );
}
