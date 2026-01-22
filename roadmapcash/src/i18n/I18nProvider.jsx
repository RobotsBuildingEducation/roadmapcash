import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { detectUserLanguage } from "@/i18n/languageDetection";
import { translations } from "@/i18n/translations";

const I18nContext = createContext(null);

const resolveTranslation = (language, key) => {
  const fallback = translations.en;
  const dictionary = translations[language] || fallback;
  return key.split(".").reduce((value, part) => value?.[part], dictionary);
};

const formatTranslation = (value, params) => {
  if (typeof value === "function") {
    return value(params || {});
  }
  if (typeof value === "string") {
    return Object.entries(params || {}).reduce(
      (result, [paramKey, paramValue]) =>
        result.replace(`{${paramKey}}`, String(paramValue)),
      value,
    );
  }
  return value;
};

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") return "en";
    const detected = detectUserLanguage();
    return translations[detected] ? detected : "en";
  });

  const setLanguage = useCallback((next) => {
    setLanguageState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("appLanguage", next);
    }
  }, []);

  const t = useCallback(
    (key, params) => {
      const value = resolveTranslation(language, key);
      if (value === undefined) {
        return key;
      }
      return formatTranslation(value, params);
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      availableLanguages: Object.keys(translations),
    }),
    [language, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
