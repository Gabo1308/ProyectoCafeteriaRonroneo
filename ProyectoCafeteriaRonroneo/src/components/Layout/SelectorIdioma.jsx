import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";

export function SelectorIdioma() {
  const { t, i18n } = useTranslation();

  const idiomaActual = i18n.resolvedLanguage?.startsWith("en")
    ? "en"
    : "es";

  const cambiarIdioma = (event) => {
    const nuevoIdioma = event.target.value;

    i18n.changeLanguage(nuevoIdioma);
    localStorage.setItem("idioma", nuevoIdioma);
    document.documentElement.lang = nuevoIdioma;
  };

}