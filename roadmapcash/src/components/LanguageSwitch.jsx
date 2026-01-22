import { Button, HStack } from "@chakra-ui/react";
import { useI18n } from "@/i18n/I18nProvider";
import { useColorModeValue } from "@/components/ui/color-mode";

export function LanguageSwitch() {
  const { language, setLanguage, t, availableLanguages } = useI18n();
  const switchBg = useColorModeValue("white", "gray.900");
  const switchBorder = useColorModeValue("gray.200", "gray.700");
  const languages = availableLanguages.filter((item) =>
    ["en", "es"].includes(item),
  );

  return (
    <HStack
      spacing="1"
      borderRadius="full"
      borderWidth="1px"
      borderColor={switchBorder}
      bg={switchBg}
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
