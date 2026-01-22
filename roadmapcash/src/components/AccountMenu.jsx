import { useMemo, useState } from "react";
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
import { IoIosMore } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import { CiSquarePlus } from "react-icons/ci";
import { LuBadgeCheck, LuKeyRound } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";

export function AccountMenu({
  identity,
  isLoading,
  error,
  onSwitchAccount,
  onLogout,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [nsecInput, setNsecInput] = useState("");
  const [switchError, setSwitchError] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);
  const currentSecret = identity?.nsec || "";

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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyWithToast = async (text, title) => {
    if (!text) {
      toaster.create({
        title: "Nothing to copy",
        type: "warning",
      });
      return;
    }

    await copyToClipboard(text);
    toaster.create({
      title,
      type: "success",
    });
  };

  const installSteps = useMemo(
    () => [
      {
        id: "step1",
        icon: <IoIosMore size={28} />,
        text: "Open the browser menu.",
      },
      {
        id: "step2",
        icon: <MdOutlineFileUpload size={28} />,
        text: "Choose 'Share' or 'Install'.",
      },
      {
        id: "step3",
        icon: <CiSquarePlus size={28} />,
        text: "Add to Home Screen.",
      },
      {
        id: "step4",
        icon: <LuBadgeCheck size={28} />,
        text: "Launch from your Home Screen.",
      },
      {
        id: "step5",
        icon: <LuKeyRound size={24} />,
        text: "Copy your secret key to sign into your account",
        subText:
          "This key is the only way to access your accounts on Robots Building Education apps. Store it in a password manager or a safe place. We cannot recover it for you.",
        action: (
          <Button
            size="xs"
            padding={4}
            leftIcon={<LuKeyRound size={14} />}
            colorScheme="orange"
            onClick={() =>
              copyWithToast(currentSecret, "Secret key copied")
            }
            isDisabled={!currentSecret}
          >
            Copy Secret Key
          </Button>
        ),
      },
    ],
    [currentSecret]
  );

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
                  <Button
                    onClick={() =>
                      copyWithToast(identity.npub, "User ID copied")
                    }
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    leftIcon={<HiUserCircle />}
                  >
                    Copy User ID
                  </Button>

                  <Button
                    onClick={() =>
                      copyWithToast(identity.nsec, "Secret key copied")
                    }
                    colorScheme="purple"
                    variant="outline"
                    size="sm"
                    leftIcon={<HiKey />}
                  >
                    Copy Secret Key
                  </Button>

                  <Button
                    onClick={() => setShowSwitchModal(true)}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                  >
                    Switch Account
                  </Button>

                  <Button
                    onClick={() => setShowInstallModal(true)}
                    colorScheme="orange"
                    variant="outline"
                    size="sm"
                  >
                    Install App
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

      {showInstallModal && (
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
          onClick={() => setShowInstallModal(false)}
        >
          <Box
            bg="gray.800"
            p="6"
            borderRadius="lg"
            width={{ base: "90%", sm: "440px" }}
            maxWidth="440px"
            boxShadow="2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <VStack align="stretch" gap="4">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  Install App
                </Text>
                <IconButton
                  aria-label="Close"
                  onClick={() => setShowInstallModal(false)}
                  variant="ghost"
                  size="sm"
                >
                  <HiX size={20} />
                </IconButton>
              </HStack>

              <VStack align="stretch" gap="4">
                {installSteps.map((step) => (
                  <Box
                    key={step.id}
                    p="3"
                    bg="gray.900"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.700"
                  >
                    <HStack align="flex-start" gap="3">
                      <Box color="orange.200" mt="1">
                        {step.icon}
                      </Box>
                      <VStack align="stretch" spacing="2">
                        <Text fontSize="sm" fontWeight="semibold">
                          {step.text}
                        </Text>
                        {step.subText && (
                          <Text fontSize="xs" color="gray.400">
                            {step.subText}
                          </Text>
                        )}
                        {step.action && (
                          <Box mt="1">{step.action}</Box>
                        )}
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </VStack>
          </Box>
        </Box>
      )}
    </>
  );
}

export default AccountMenu;
