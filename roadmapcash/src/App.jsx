import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Box, HStack, VStack, Text, Spinner } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useDecentralizedIdentity } from "@/hooks/useDecentralizedIdentity";
import { useFinancialParser } from "@/hooks/useFinancialParser";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { AccountMenu } from "@/components/AccountMenu";
import { FinancialInput } from "@/components/FinancialInput";
import { FinancialChart } from "@/components/FinancialChart";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Toaster } from "@/components/ui/toaster";
import { useI18n } from "@/i18n/I18nProvider";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import "./App.css";

function App() {
  const { t, language, setLanguage } = useI18n();
  const {
    identity,
    userData,
    isLoading,
    error,
    switchAccount,
    logout,
    saveRoadmap,
    updateUserData,
  } = useDecentralizedIdentity();
  const {
    parseFinancialInput,
    updateFinancialData,
    updateFinancialItem,
    streamPortfolioQuality,
    financialData,
    setFinancialData,
    portfolioQualityDraft,
    isLoading: isGenerating,
    error: parseError,
    isUpdating,
    updateError,
  } = useFinancialParser();

  // Get saved roadmap from userData directly
  const savedRoadmap = userData?.roadmap;

  // Initialize input state - use saved input if available
  const [userInput, setUserInput] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [loaderStep, setLoaderStep] = useState(0);
  const skipLanguageSyncRef = useRef(false);
  const hasHydratedLanguageRef = useRef(false);
  const skipThemeSyncRef = useRef(false);
  const hasHydratedThemeRef = useRef(false);
  const { colorMode, setColorMode } = useColorMode();
  const pageBg = useColorModeValue("#faf9f5", "gray.950");
  const pageColor = useColorModeValue("gray.900", "white");
  const headerBg = useColorModeValue("#faf9f5", "gray.950");
  const headerBorder = useColorModeValue("gray.200", "gray.800");
  const loaderCardBg = useColorModeValue("white", "gray.900");
  const loaderCardBorder = useColorModeValue("gray.200", "gray.800");
  const loaderTextColor = useColorModeValue("gray.600", "gray.400");
  // Initialize from saved data (called once by callback ref)
  const initializeFromSaved = useCallback(
    (node) => {
      if (node && savedRoadmap && !isInitialized) {
        if (savedRoadmap.userInput) {
          setUserInput(savedRoadmap.userInput);
        }
        if (savedRoadmap.financialData && !financialData) {
          setFinancialData(savedRoadmap.financialData);
        }
        setIsInitialized(true);
      }
    },
    [savedRoadmap, isInitialized, financialData, setFinancialData],
  );

  const hasSavedData =
    Boolean(savedRoadmap?.financialData) || Boolean(financialData);

  const handleGenerate = async (input) => {
    const result = await parseFinancialInput(input);
    if (result) {
      // Save the roadmap data after successful generation
      await saveRoadmap(input, result);
    }
  };

  const handleUpdate = async (updateInput) => {
    if (!financialData) return;
    const result = await updateFinancialData(financialData, updateInput);
    if (result) {
      await saveRoadmap(userInput, result, updateInput);
    }
  };

  const handleItemUpdate = async (updateInput) => {
    if (!financialData) return;
    const result = await updateFinancialItem(financialData, updateInput);
    if (result) {
      await saveRoadmap(userInput, result, updateInput);
    }
  };

  const handlePortfolioQualityStream = async (allocations) => {
    if (!financialData) return;
    const result = await streamPortfolioQuality(financialData, allocations);
    if (result) {
      await saveRoadmap(userInput, result, "Portfolio quality summary");
    }
  };

  const loaderMessages = useMemo(() => t("app.loaderMessages"), [t]);

  useEffect(() => {
    const storedLanguage = userData?.settings?.language;
    if (!storedLanguage || hasHydratedLanguageRef.current) return;
    if (storedLanguage !== language) {
      skipLanguageSyncRef.current = true;
      setLanguage(storedLanguage);
    }
    hasHydratedLanguageRef.current = true;
  }, [language, setLanguage, userData]);

  useEffect(() => {
    const storedTheme = userData?.settings?.theme;
    if (!storedTheme || hasHydratedThemeRef.current) return;
    if (storedTheme !== colorMode) {
      skipThemeSyncRef.current = true;
      setColorMode(storedTheme);
    }
    hasHydratedThemeRef.current = true;
  }, [colorMode, setColorMode, userData]);

  useEffect(() => {
    if (!identity?.npub || !userData) return;
    if (skipLanguageSyncRef.current) {
      skipLanguageSyncRef.current = false;
      return;
    }
    const storedLanguage = userData.settings?.language;
    if (language && storedLanguage !== language) {
      updateUserData({
        settings: {
          ...(userData.settings || {}),
          language,
        },
      });
    }
  }, [identity?.npub, language, updateUserData, userData]);

  useEffect(() => {
    if (!identity?.npub || !userData) return;
    if (skipThemeSyncRef.current) {
      skipThemeSyncRef.current = false;
      return;
    }
    const storedTheme = userData.settings?.theme;
    if (colorMode && storedTheme !== colorMode) {
      updateUserData({
        settings: {
          ...(userData.settings || {}),
          theme: colorMode,
        },
      });
    }
  }, [colorMode, identity?.npub, updateUserData, userData]);

  useEffect(() => {
    if (!isGenerating || financialData) {
      setLoaderStep(0);
      return;
    }

    const intervalId = setInterval(() => {
      setLoaderStep((prev) => (prev + 1) % loaderMessages.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [financialData, isGenerating, loaderMessages.length]);

  const loaderFade = keyframes`
    0%, 100% { opacity: 0; }
    15%, 85% { opacity: 1; }
  `;

  return (
    <Box minH="100vh" bg={pageBg} color={pageColor}>
      <Toaster />
      <HStack
        as="header"
        justify="space-between"
        align="center"
        p="4"
        borderBottomWidth="1px"
        borderColor={headerBorder}
        position="sticky"
        top="0"
        bg={headerBg}
        zIndex="sticky"
      >
        <AnimatedLogo />

        <HStack spacing="2">
          <LanguageSwitch />
          <AccountMenu
            identity={identity}
            isLoading={isLoading}
            error={error}
            onSwitchAccount={switchAccount}
            onLogout={logout}
            theme={colorMode}
            onThemeChange={setColorMode}
          />
        </HStack>
      </HStack>

      <Box as="main" p={{ base: "3", md: "6" }}>
        {isLoading ? (
          <VStack py={{ base: "10", md: "20" }}>
            <Spinner size="xl" color="blue.400" />
            <Text color="gray.400" mt="4">
              {t("app.initializingIdentity")}
            </Text>
          </VStack>
        ) : error ? (
          <VStack py={{ base: "10", md: "20" }}>
            <Text color="red.400" fontSize="lg">
              {t("app.errorPrefix", { error })}
            </Text>
          </VStack>
        ) : identity ? (
          <VStack
            ref={initializeFromSaved}
            align="stretch"
            gap={{ base: "4", md: "6" }}
            maxW="900px"
            mx="auto"
          >
            <FinancialInput
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              input={userInput}
              onInputChange={setUserInput}
              hasSavedData={hasSavedData}
            />

            {(parseError || updateError) && (
              <Box
                p="4"
                bg="red.900"
                borderRadius="md"
                borderWidth="1px"
                borderColor="red.700"
              >
                <Text color="red.200" fontSize="sm">
                  {parseError || updateError}
                </Text>
              </Box>
            )}

            {isGenerating && !financialData && (
              <Box
                p={{ base: "6", md: "8" }}
                bg={loaderCardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={loaderCardBorder}
              >
                <VStack spacing="4">
                  <AnimatedLogo showWordmark={false} size={120} />
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="semibo  ld"
                  >
                    {t("app.buildingPlan")}
                  </Text>
                  <Text
                    key={loaderStep}
                    color={loaderTextColor}
                    fontSize="sm"
                    textAlign="center"
                    animation={`${loaderFade} 2s ease-in-out`}
                  >
                    {loaderMessages[loaderStep]}
                  </Text>
                </VStack>
              </Box>
            )}

            {financialData && (
              <FinancialChart
                data={financialData}
                onUpdate={handleUpdate}
                onItemUpdate={handleItemUpdate}
                onPortfolioQuality={handlePortfolioQualityStream}
                isUpdating={isUpdating}
                portfolioQualityDraft={portfolioQualityDraft}
              />
            )}
          </VStack>
        ) : null}
      </Box>
    </Box>
  );
}

export default App;
