"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const formatKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1") // Insert space before capital letters
    .toLowerCase() // Convert entire string to lowercase
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize first letter only
};
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      usernameTaken: "Username is already taken",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    parseMissingKeyHandler: (key) => formatKey(key),
  });

export default i18n;
