import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ua",
    supportedLngs: ["en", "uk"],
    load: "languageOnly",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath() {
        return `${import.meta.env.VITE_BASE_URL}locales/{{lng}}/{{ns}}.json`;
      },
    },
  });

i18n.on("languageChanged", (lng) => {
  const normalizedLng = lng.split("-")[0]; // Strip the region code (e.g., 'en-US' -> 'en')
  if (normalizedLng !== lng) {
    i18n.changeLanguage(normalizedLng); // Change to normalized language
  }
});

export default i18n;
