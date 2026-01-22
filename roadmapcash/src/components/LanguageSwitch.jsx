import { Button, HStack } from "@chakra-ui/react";
import { useI18n } from "@/i18n/I18nProvider";

export function LanguageSwitch() {
  const { language, setLanguage, t, availableLanguages } = useI18n();
  const languages = availableLanguages.filter((item) =>
    ["en", "es"].includes(item),
  );

  return (
    <HStack
      spacing="1"
      borderRadius="full"
      borderWidth="1px"
      borderColor="gray.700"
      bg="gray.900"
      p="1"
      aria-label={t("header.languageSwitchLabel")}
    >
      {languages.map((lang) => (
        <Button
          key={lang}
          size="xs"
          variant={language === lang ? "solid" : "ghost"}
          colorScheme={language === lang ? "blue" : "gray"}
          borderRadius="full"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
        >
          {lang.toUpperCase()}
        </Button>
      ))}
    </HStack>
  );
}

export default LanguageSwitch;
