import { Box, HStack, VStack, Text, Spinner } from "@chakra-ui/react";
import { useDecentralizedIdentity } from "@/hooks/useDecentralizedIdentity";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { AccountMenu } from "@/components/AccountMenu";
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
            <Box
              p="6"
              bg="gray.900"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.800"
            >
              <Text fontSize="xl" fontWeight="bold" mb="4">
                Welcome to roadmap.cash
              </Text>
              <Text color="gray.400" mb="4">
                Your decentralized identity is ready. Your account is tied to
                your unique keys - no email or password required.
              </Text>

              <Box
                p="4"
                bg="gray.800"
                borderRadius="md"
                fontFamily="mono"
                fontSize="sm"
              >
                <Text color="gray.500" mb="1">
                  Your public identity:
                </Text>
                <Text color="blue.300" wordBreak="break-all" fontSize="xs">
                  {identity.npub}
                </Text>
              </Box>
            </Box>

            {userData && (
              <Box
                p="6"
                bg="gray.900"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.800"
              >
                <Text fontSize="lg" fontWeight="medium" mb="2">
                  Account Created
                </Text>
                <Text color="gray.400" fontSize="sm">
                  {new Date(userData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </Box>
            )}
          </VStack>
        ) : null}
      </Box>
    </Box>
  );
}

export default App;
