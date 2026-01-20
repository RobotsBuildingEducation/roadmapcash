import { Box, HStack, VStack, Text, Spinner } from "@chakra-ui/react";
import { useDecentralizedIdentity } from "@/hooks/useDecentralizedIdentity";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { AccountMenu } from "@/components/AccountMenu";
import { MonthlyGoalChart } from "@/components/MonthlyGoalChart";
import "./App.css";

function App() {
  const { identity, userData, isLoading, error, switchAccount, logout } =
    useDecentralizedIdentity();

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
          <VStack align="stretch" gap="6" maxW="600px" mx="auto">
            {/* Monthly Goal Chart with Fat Dogs */}
            <MonthlyGoalChart />

            {/* Identity Info (collapsed) */}
            <Box
              p="4"
              bg="gray.900"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.800"
            >
              <Text fontSize="sm" color="gray.500" mb="1">
                Your public identity:
              </Text>
              <Text color="blue.300" wordBreak="break-all" fontSize="xs" fontFamily="mono">
                {identity.npub}
              </Text>
              {userData && (
                <Text color="gray.600" fontSize="xs" mt="2">
                  Member since {new Date(userData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </Text>
              )}
            </Box>
          </VStack>
        ) : null}
      </Box>
    </Box>
  );
}

export default App;
