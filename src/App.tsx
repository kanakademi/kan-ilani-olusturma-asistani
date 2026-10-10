import { useEffect, useRef, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { trTR } from "@mui/material/locale";
import Swal from "sweetalert2";
import "./i18n";

import TopBar from "./components/TopBar";
import PageHeader from "./components/PageHeader";
import BloodDonationFormContainer from "./components/BloodDonationFormContainer";
import LegalNotice from "./components/LegalNotice";
import Copyright from "./components/Copyright";

function App() {
  const { t, i18n } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // tema kanakademi.com.tr ile ortak: aynı alan adında "kk-tema" anahtarı (koyu/acik); yoksa sistem tercihi
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    let kayitli: string | null = null;
    try {
      kayitli = localStorage.getItem("kk-tema");
    } catch {
      /* gizli sekme vb. */
    }
    if (kayitli === "koyu") return "dark";
    if (kayitli === "acik") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [isPlaying, setIsPlaying] = useState(false);

  // Dil varsayılan olarak Türkçe (i18n.ts: lng "tr"); İngilizce isteyen üstteki EN düğmesini kullanır.
  // Önceden tarayıcı diline göre İngilizce açılıyordu; ilanlar Türkiye'de paylaşılıyor.

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("kk-tema", next === "dark" ? "koyu" : "acik");
    } catch {
      /* gizli sekme vb. */
    }
  };

  const handleInfoClick = async () => {
    const res = await fetch(import.meta.env.VITE_COUNTER_API);
    const json = await res.json();
    const count = Number(json.counter ?? 0).toLocaleString(i18n.language);
    Swal.fire({
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <style>                
                .logo { width: 80px; margin-bottom: 20px; }
                .containerr { text-align: center; }
                .main-title { font-size: 2.5em; font-weight: 800; margin: 10px 0; color: #e3262f; }
            </style>
        </head>
        <body>
          <div class="containerr">
            <img class="logo" src="./assets/images/kan-akademi-logo.png" alt="Kan Akademi Logo" />
            <div>${t("infoSiteTotal")}</div>
            <div class="main-title">${t("infoMainTitle", { count } as any)}</div>
            <div>${t("infoHelpedPeople", { count } as any)}</div>
          </div>
        </body>
        </html>
      `,
      showConfirmButton: true,
      confirmButtonText: t("close"),
      background: "#ffffff",
      confirmButtonColor: "#e3262f",
    });
  };

  const handleSpeakClick = () => {
    const lang = i18n.language.startsWith("tr") ? "tr" : "en";
    const audioFile = lang === "tr" ? "./assets/audios/page-content-audio-tr.mp3" : "./assets/audios/page-content-audio-en.mp3";

    if (audioRef.current) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }
    }

    audioRef.current = new Audio(audioFile);
    audioRef.current.onended = () => setIsPlaying(false);
    audioRef.current.play();
    setIsPlaying(true);
  };

  // kanakademi.com.tr ile aynı renkler ve yazı tipi
  const muiTheme = createTheme(
    {
      palette: {
        mode: theme,
        primary: { main: "#e3262f", dark: "#b3121c", contrastText: "#fff" },
        secondary: { main: "#1ba6df" },
        ...(theme === "dark"
          ? { background: { default: "#0e0a2e", paper: "#1b1546" } }
          : { background: { default: "#f6f5fb", paper: "#ffffff" } }),
      },
      shape: { borderRadius: 12 },
      typography: {
        fontFamily: '"Plus Jakarta Sans Variable", system-ui, sans-serif',
        button: { textTransform: "none", fontWeight: 700 },
      },
    },
    trTR
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <TopBar
        theme={theme}
        toggleTheme={toggleTheme}
        handleInfoClick={handleInfoClick}
        changeLanguage={(lang) => i18n.changeLanguage(lang)}
        handleSpeakClick={handleSpeakClick}
        isPlaying={isPlaying}
      />
      <PageHeader />
      <BloodDonationFormContainer />
      <LegalNotice />
      <Copyright />
    </ThemeProvider>
  );
}

export default App;
