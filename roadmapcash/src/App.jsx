import { useState, useCallback } from "react";
import { Box, HStack, VStack, Text, Spinner } from "@chakra-ui/react";
import { useDecentralizedIdentity } from "@/hooks/useDecentralizedIdentity";
import { useFinancialParser } from "@/hooks/useFinancialParser";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { AccountMenu } from "@/components/AccountMenu";
import { FinancialInput } from "@/components/FinancialInput";
import { FinancialChart } from "@/components/FinancialChart";
import "./App.css";

function App() {
  const {
    identity,
    userData,
    isLoading,
    error,
    switchAccount,
    logout,
    saveRoadmap,
  } = useDecentralizedIdentity();
  const {
    parseFinancialInput,
    updateFinancialData,
    financialData,
    setFinancialData,
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
  const [updateDraft, setUpdateDraft] = useState("");

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
        if (savedRoadmap.lastUpdatePrompt) {
          setUpdateDraft(savedRoadmap.lastUpdatePrompt);
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
      setUpdateDraft(updateInput);
    }
  };

  return (
    <Box minH="100vh" bg="gray.950" color="white">
      <HStack
        as="header"
        justify="space-between"
        align="center"
        p="4"
        borderBottomWidth="1px"
        borderColor="gray.800"
        position="sticky"
        top="0"
        bg="gray.950"
        zIndex="sticky"
      >
        <AnimatedLogo />

        <AccountMenu
          identity={identity}
          isLoading={isLoading}
          error={error}
          onSwitchAccount={switchAccount}
          onLogout={logout}
        />
      </HStack>

      <Box as="main" p={{ base: "3", md: "6" }}>
        {isLoading ? (
          <VStack py={{ base: "10", md: "20" }}>
            <Spinner size="xl" color="blue.400" />
            <Text color="gray.400" mt="4">
              Initializing identity...
            </Text>
          </VStack>
        ) : error ? (
          <VStack py={{ base: "10", md: "20" }}>
            <Text color="red.400" fontSize="lg">
              Error: {error}
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
              onUpdate={handleUpdate}
              isGenerating={isGenerating}
              isUpdating={isUpdating}
              input={userInput}
              onInputChange={setUserInput}
              hasSavedData={hasSavedData}
              updateDraft={updateDraft}
              onUpdateDraftChange={setUpdateDraft}
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

            {financialData && (
              <FinancialChart data={financialData} onUpdate={handleUpdate} />
            )}
          </VStack>
        ) : null}
      </Box>
    </Box>
  );
}

export default App;
