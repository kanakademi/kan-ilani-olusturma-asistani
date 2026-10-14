import { useTranslation } from "react-i18next";
import LabeledTextField from "./LabeledTextField";
import { Checkbox, FormControlLabel, IconButton, MenuItem, TextField } from "@mui/material";
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
const BLOOD_TYPE_KEYS: Record<string, string> = Object.fromEntries(BLOOD_TYPES);

interface InputProps {
  donationInfo: DonationInfo;
  selectedTemplate: number;
  showErrors: boolean;
  handleDonationInfoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setBloodGroups: (groups: string[]) => void;
  setBloodType: (types: string[]) => void;
  handleDonationInfoPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDonationInfoDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTemplateChange: (index: number) => void;
}

export default function BloodDonationFormInputs(props: InputProps) {
  const { t } = useTranslation();
  const { donationInfo: d, showErrors } = props;

  const isEmpty = (val: string) => val.trim().length === 0;

  const hasRegardless = d.bloodGroup.includes(REGARDLESS_BLOOD_GROUP);
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
        {/* uzun düğme ızgarası yerine açılır liste: ekranda tek alan görünür (eski sitedeki gibi) */}
        <TextField
          select
          fullWidth
          size="small"
          margin="dense"
          label={t("bloodGroup")}
          value={d.bloodGroup}
          error={bloodGroupError}
          helperText={bloodGroupError ? t("requiredText") : ""}
          slotProps={{ select: { multiple: true, renderValue: (v) => (v as string[]).map((g) => (g === REGARDLESS_BLOOD_GROUP ? t("regardlessOfBloodType") : g)).join(", ") } }}
          onChange={(e) => props.setBloodGroups(e.target.value as unknown as string[])}
        >
          {[...BLOOD_GROUPS, REGARDLESS_BLOOD_GROUP].map((group) => {
            const selected = d.bloodGroup.includes(group);
            // PR #46: "fark etmeksizin" seçiliyken diğerleri, 4 grup seçiliyken seçilmemişler ve "fark etmeksizin" kapalı;
            // seçili olanlar tıklanabilir kalır ki biri bırakılıp başkası seçilebilsin
            const disabled = group === REGARDLESS_BLOOD_GROUP ? limitReached : (hasRegardless || limitReached) && !selected;
            return (
              <MenuItem key={group} value={group} disabled={disabled}>
                <Checkbox size="small" checked={selected} sx={{ p: 0, mr: 1 }} />
                {group === REGARDLESS_BLOOD_GROUP ? t("regardlessOfBloodType") : group}
              </MenuItem>
            );
          })}
        </TextField>

        <TextField
          select
          fullWidth
          size="small"
          margin="dense"
          label={t("bloodType")}
          value={d.bloodType}
          error={bloodTypeError}
          helperText={bloodTypeError ? t("requiredText") : ""}
          slotProps={{ select: { multiple: true, renderValue: (v) => (v as string[]).map((x) => t(BLOOD_TYPE_KEYS[x] ?? x)).join(", ") } }}
          onChange={(e) => props.setBloodType(e.target.value as unknown as string[])}
        >
          {BLOOD_TYPES.map(([value, key]) => (
            <MenuItem key={value} value={value}>
              <Checkbox size="small" checked={d.bloodType.includes(value)} sx={{ p: 0, mr: 1 }} />
              {t(key)}
            </MenuItem>
          ))}
        </TextField>

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
          placeholder="0000 000 00 00"
          slotProps={{ htmlInput: { inputMode: "tel" }, inputLabel: { shrink: true } }}
          value={d.phone}
          onChange={props.handleDonationInfoPhoneChange}
          error={phoneError}
          helperText={phoneError ? t("requiredText") : ""}
        />

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

        <TextField
          select
          fullWidth
          size="small"
          margin="dense"
          label={t("templateSelection")}
          value={props.selectedTemplate}
          onChange={(e) => props.handleTemplateChange(Number(e.target.value))}
        >
          {getTemplateList().map((template, index) => (
            <MenuItem key={template.id} value={index}>
              <span className="sablon__renk" style={{ background: template.selectorColor }} aria-hidden="true" />
              {template.name}
            </MenuItem>
          ))}
        </TextField>
    </form>
  );
}
