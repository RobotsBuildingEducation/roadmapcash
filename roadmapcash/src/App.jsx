import { Box, HStack, VStack, Text, Spinner } from "@chakra-ui/react";
import { useDecentralizedIdentity } from "@/hooks/useDecentralizedIdentity";
import { useFinancialParser } from "@/hooks/useFinancialParser";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { AccountMenu } from "@/components/AccountMenu";
import { FinancialInput } from "@/components/FinancialInput";
import { FinancialChart } from "@/components/FinancialChart";
import "./App.css";

function App() {
  const { identity, userData, isLoading, error, switchAccount, logout } =
    useDecentralizedIdentity();
  const {
    parseFinancialInput,
    financialData,
    isLoading: isGenerating,
    error: parseError,
  } = useFinancialParser();

  const handleGenerate = async (input, additionalContext) => {
    await parseFinancialInput(input, additionalContext);
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

      <Box as="main" p="6">
        {isLoading ? (
          <VStack py="20">
            <Spinner size="xl" color="blue.400" />
            <Text color="gray.400" mt="4">
              Initializing identity...
            </Text>
          </VStack>
        ) : error ? (
          <VStack py="20">
            <Text color="red.400" fontSize="lg">
              Error: {error}
            </Text>
          </VStack>
        ) : identity ? (
          <VStack align="stretch" gap="6" maxW="900px" mx="auto">
            <FinancialInput
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />

            {parseError && (
              <Box
                p="4"
                bg="red.900"
                borderRadius="md"
                borderWidth="1px"
                borderColor="red.700"
              >
                <Text color="red.200" fontSize="sm">
                  {parseError}
                </Text>
              </Box>
            )}

            {financialData && <FinancialChart data={financialData} />}
          </VStack>
        ) : null}
      </Box>
    </Box>
  );
}

export default App;
