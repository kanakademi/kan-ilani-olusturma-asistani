import { useTranslation } from "react-i18next";
import { DarkModeOutlined, InfoOutlined, LightModeOutlined, PauseRounded, VolumeUpOutlined } from "@mui/icons-material";
import "./TopBar.css";

interface TopBarProps {
  theme: "light" | "dark";
  isPlaying: boolean;
  toggleTheme: () => void;
  handleInfoClick: () => void;
  changeLanguage: (lang: string) => void;
  handleSpeakClick: () => void;
}

// kanakademi.com.tr başlığıyla aynı düzen: solda logo, sağda araçlar
export default function TopBar(props: TopBarProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "tr";

  return (
    <header className="ust">
      <a className="ust__logo" href="https://kanakademi.com.tr/" aria-label="Kan Akademi anasayfa">
        <img src="./assets/images/kan-akademi-logo.png" alt="" width="26" height="40" />
        <span>Kan Akademi</span>
      </a>

      <div className="ust__araclar">
        <div className="ust__dil" role="group" aria-label={t("topBarLeftButtonGroup")}>
          {(["tr", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lang === l}
              aria-label={t(l === "tr" ? "topBarTrButton" : "topBarEnButton")}
              onClick={() => props.changeLanguage(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="ust__ikon" title={t("topBarThemeButton")} aria-label={t("topBarThemeButton")} onClick={props.toggleTheme}>
          {props.theme === "light" ? <DarkModeOutlined fontSize="small" /> : <LightModeOutlined fontSize="small" />}
        </button>
        <button
          type="button"
          className="ust__ikon"
          title={t("topBarSoundButton")}
          aria-label={t("topBarSoundButton")}
          aria-pressed={props.isPlaying}
          onClick={props.handleSpeakClick}
        >
          {props.isPlaying ? <PauseRounded fontSize="small" /> : <VolumeUpOutlined fontSize="small" />}
        </button>
        <button type="button" className="ust__ikon" title={t("topBarInfoButton")} aria-label={t("topBarInfoButton")} onClick={props.handleInfoClick}>
          <InfoOutlined fontSize="small" />
        </button>
      </div>
    </header>
  );
}
