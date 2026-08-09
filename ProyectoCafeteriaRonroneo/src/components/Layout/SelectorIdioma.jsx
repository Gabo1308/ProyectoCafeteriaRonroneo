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

  return (
    <Tooltip title={t("header.language")}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mr: 1,
        }}
      >
        <LanguageIcon color="primary" />

        <FormControl size="small">
          <Select
            value={idiomaActual}
            onChange={cambiarIdioma}
            inputProps={{
              "aria-label": t("header.language"),
            }}
            sx={{
              minWidth: 72,
              height: 36,
              color: "primary.dark",
              fontWeight: 700,
            }}
          >
            <MenuItem value="es">ES</MenuItem>
            <MenuItem value="en">EN</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Tooltip>
  );
}