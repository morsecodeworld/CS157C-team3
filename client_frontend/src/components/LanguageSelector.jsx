import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = React.useState(i18n.language);

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <FormControl margin="normal" sx={{ m: 1 }} size="small" fullWidth>
      <InputLabel id="language-select-label">{t("Language")}</InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={language}
        label={t("Language")}
        onChange={handleLanguageChange}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="hi">हिन्दी</MenuItem>
        <MenuItem value="mr">मराठी</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
