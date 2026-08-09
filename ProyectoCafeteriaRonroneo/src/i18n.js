import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import traduccionesES from "./locales/es.json";
import traduccionesEN from "./locales/en.json";

const idiomaGuardado = localStorage.getItem("idioma") || "es";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: traduccionesES,
      },
      en: {
        translation: traduccionesEN,
      },
    },
    lng: idiomaGuardado,
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    interpolation: {
      escapeValue: false,
    },
  });

document.documentElement.lang = idiomaGuardado;

export default i18n;