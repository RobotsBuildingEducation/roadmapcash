import { useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { HiMenu, HiX, HiUserCircle, HiLogout, HiKey } from "react-icons/hi";

export function AccountMenu({
  identity,
  isLoading,
  error,
  onSwitchAccount,
  onLogout,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [nsecInput, setNsecInput] = useState("");
  const [switchError, setSwitchError] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchAccount = async () => {
    if (!nsecInput.trim()) {
      setSwitchError("Please enter an nsec");
      return;
    }

    if (!nsecInput.trim().startsWith("nsec")) {
      setSwitchError("Invalid nsec format. Must start with 'nsec'");
      return;
    }

    setIsSwitching(true);
    setSwitchError("");

    try {
      await onSwitchAccount(nsecInput);
    } catch (err) {
      setSwitchError(err.message || "Failed to switch account");
      setIsSwitching(false);
    }
  };

  const truncateKey = (key, chars = 8) => {
    if (!key) return "";
    return `${key.slice(0, chars)}...${key.slice(-chars)}`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <IconButton
        aria-label="Menu"
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="lg"
      >
        <HiMenu size={24} />
      </IconButton>

      {isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          zIndex="overlay"
          onClick={() => setIsOpen(false)}
        >
          <Box
            position="fixed"
            top="0"
            right="0"
            width={{ base: "100%", sm: "350px" }}
            height="100%"
            bg="gray.900"
            boxShadow="xl"
            onClick={(e) => e.stopPropagation()}
            overflowY="auto"
          >
            <VStack align="stretch" p="4" gap="4">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  Account
                </Text>
                <IconButton
                  aria-label="Close"
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                >
                  <HiX size={20} />
                </IconButton>
              </HStack>

              {isLoading ? (
                <Text color="gray.400">Loading...</Text>
              ) : identity ? (
                <VStack align="stretch" gap="3">
                  <Box
                    p="3"
                    bg="gray.800"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.700"
                  >
                    <HStack gap="2" mb="2">
                      <HiUserCircle size={20} />
                      <Text fontSize="sm" fontWeight="medium">
                        Public Key (npub)
                      </Text>
                    </HStack>
                    <Text
                      fontSize="xs"
                      fontFamily="mono"
                      color="blue.300"
                      cursor="pointer"
                      onClick={() => copyToClipboard(identity.npub)}
                      _hover={{ color: "blue.200" }}
                    >
                      {truncateKey(identity.npub, 12)}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt="1">
                      Click to copy
                    </Text>
                  </Box>

                  <Box
                    p="3"
                    bg="gray.800"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.700"
                  >
                    <HStack gap="2" mb="2">
                      <HiKey size={20} />
                      <Text fontSize="sm" fontWeight="medium">
                        Secret Key (nsec)
                      </Text>
                    </HStack>
                    <Text
                      fontSize="xs"
                      fontFamily="mono"
                      color="purple.300"
                      cursor="pointer"
                      onClick={() => copyToClipboard(identity.nsec)}
                      _hover={{ color: "purple.200" }}
                    >
                      {truncateKey(identity.nsec, 12)}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt="1">
                      Click to copy - Keep this secret!
                    </Text>
                  </Box>

                  <Button
                    onClick={() => setShowSwitchModal(true)}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                  >
                    Switch Account
                  </Button>

                  <Button
                    onClick={onLogout}
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                  >
                    <HiLogout />
                    <Text ml="2">Logout</Text>
                  </Button>
                </VStack>
              ) : (
                <Text color="gray.400">No identity loaded</Text>
              )}

              {error && (
                <Text color="red.400" fontSize="sm">
                  {error}
                </Text>
              )}
            </VStack>
          </Box>
        </Box>
      )}

      {showSwitchModal && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.700"
          zIndex="modal"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => {
            setShowSwitchModal(false);
            setNsecInput("");
            setSwitchError("");
          }}
        >
          <Box
            bg="gray.800"
            p="6"
            borderRadius="lg"
            width={{ base: "90%", sm: "400px" }}
            maxWidth="400px"
            boxShadow="2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <VStack align="stretch" gap="4">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  Switch Account
                </Text>
                <IconButton
                  aria-label="Close"
                  onClick={() => {
                    setShowSwitchModal(false);
                    setNsecInput("");
                    setSwitchError("");
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <HiX size={20} />
                </IconButton>
              </HStack>

              <Text fontSize="sm" color="gray.400">
                Paste your nsec (secret key) to switch to a different account.
                If the account doesn't exist, it will be created.
              </Text>

              <Input
                placeholder="nsec1..."
                value={nsecInput}
                onChange={(e) => {
                  setNsecInput(e.target.value);
                  setSwitchError("");
                }}
                fontFamily="mono"
                fontSize="sm"
                bg="gray.700"
                borderColor="gray.600"
                _focus={{ borderColor: "blue.400" }}
              />

              {switchError && (
                <Text color="red.400" fontSize="sm">
                  {switchError}
                </Text>
              )}

              <HStack gap="2">
                <Button
                  flex="1"
                  variant="ghost"
                  onClick={() => {
                    setShowSwitchModal(false);
                    setNsecInput("");
                    setSwitchError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  flex="1"
                  colorScheme="blue"
                  onClick={handleSwitchAccount}
                  loading={isSwitching}
                  disabled={isSwitching}
                >
                  Switch
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </>
  );
}

export default AccountMenu;
