import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  IconButton,
  Switch,
} from "@chakra-ui/react";
import { HiMenu, HiX, HiUserCircle, HiLogout, HiKey } from "react-icons/hi";
import { IoIosMore } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import { CiSquarePlus } from "react-icons/ci";
import { LuBadgeCheck, LuKeyRound } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";
import { useI18n } from "@/i18n/I18nProvider";
import { useColorModeValue } from "@/components/ui/color-mode";

export function AccountMenu({
  identity,
  isLoading,
  error,
  onSwitchAccount,
  onLogout,
  theme,
  onThemeChange,
}) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [nsecInput, setNsecInput] = useState("");
  const [switchError, setSwitchError] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);
  const currentSecret = identity?.nsec || "";
  const drawerBg = useColorModeValue("white", "gray.900");
  const drawerBorder = useColorModeValue("gray.200", "gray.700");
  const panelBg = useColorModeValue("gray.100", "gray.800");
  const modalBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");

  const handleSwitchAccount = async () => {
    if (!nsecInput.trim()) {
      setSwitchError(t("accountMenu.errors.enterNsec"));
      return;
    }

    if (!nsecInput.trim().startsWith("nsec")) {
      setSwitchError(t("accountMenu.errors.invalidNsec"));
      return;
    }

    setIsSwitching(true);
    setSwitchError("");

    try {
      await onSwitchAccount(nsecInput);
    } catch (err) {
      setSwitchError(err.message || t("accountMenu.errors.failedSwitch"));
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
        title: t("accountMenu.toasts.nothingToCopy"),
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
        text: t("accountMenu.installSteps.0"),
      },
      {
        id: "step2",
        icon: <MdOutlineFileUpload size={28} />,
        text: t("accountMenu.installSteps.1"),
      },
      {
        id: "step3",
        icon: <CiSquarePlus size={28} />,
        text: t("accountMenu.installSteps.2"),
      },
      {
        id: "step4",
        icon: <LuBadgeCheck size={28} />,
        text: t("accountMenu.installSteps.3"),
      },
      {
        id: "step5",
        icon: <LuKeyRound size={24} />,
        text: t("accountMenu.installSecretTitle"),
        subText:
          t("accountMenu.installSecretBody"),
        action: (
          <Button
            size="xs"
            padding={4}
            leftIcon={<LuKeyRound size={14} />}
            colorScheme="orange"
            onClick={() =>
              copyWithToast(currentSecret, t("accountMenu.toasts.secretKeyCopied"))
            }
            isDisabled={!currentSecret}
          >
            {t("accountMenu.copySecretKeyAction")}
          </Button>
        ),
      },
    ],
    [currentSecret, t]
  );

  return (
    <>
      <IconButton
        aria-label={t("accountMenu.menuLabel")}
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
            bg={drawerBg}
            boxShadow="xl"
            onClick={(e) => e.stopPropagation()}
            overflowY="auto"
          >
            <VStack align="stretch" p="4" gap="4">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  {t("accountMenu.accountTitle")}
                </Text>
                <IconButton
                  aria-label={t("accountMenu.close")}
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                >
                  <HiX size={20} />
                </IconButton>
              </HStack>

              <HStack
                justify="space-between"
                align="center"
                p="3"
                borderRadius="md"
                bg={panelBg}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  {t("accountMenu.themeLabel")}
                </Text>
                <HStack spacing="2">
                  <Text fontSize="xs" color="gray.400">
                    {t("accountMenu.themeLight")}
                  </Text>
                  <Switch.Root
                    checked={theme === "dark"}
                    onCheckedChange={(event) =>
                      onThemeChange?.(event.checked ? "dark" : "light")
                    }
                    aria-label={t("accountMenu.themeToggleLabel")}
                    colorScheme="blue"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                  <Text fontSize="xs" color="gray.400">
                    {t("accountMenu.themeDark")}
                  </Text>
                </HStack>
              </HStack>

              {isLoading ? (
                <Text color="gray.400">{t("accountMenu.loading")}</Text>
              ) : identity ? (
                <VStack align="stretch" gap="3">
                  <Button
                    onClick={() =>
                      copyWithToast(identity.npub, t("accountMenu.toasts.userIdCopied"))
                    }
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    leftIcon={<HiUserCircle />}
                  >
                    {t("accountMenu.copyUserId")}
                  </Button>

                  <Button
                    onClick={() =>
                      copyWithToast(identity.nsec, t("accountMenu.toasts.secretKeyCopied"))
                    }
                    colorScheme="purple"
                    variant="outline"
                    size="sm"
                    leftIcon={<HiKey />}
                  >
                    {t("accountMenu.copySecretKey")}
                  </Button>

                  <Button
                    onClick={() => setShowSwitchModal(true)}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                  >
                    {t("accountMenu.switchAccount")}
                  </Button>

                  <Button
                    onClick={() => setShowInstallModal(true)}
                    colorScheme="orange"
                    variant="outline"
                    size="sm"
                  >
                    {t("accountMenu.installApp")}
                  </Button>

                  <Button
                    onClick={onLogout}
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                  >
                    <HiLogout />
                    <Text ml="2">{t("accountMenu.logout")}</Text>
                  </Button>
                </VStack>
              ) : (
                <Text color="gray.400">{t("accountMenu.noIdentity")}</Text>
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
            bg={modalBg}
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
                  {t("accountMenu.switchModalTitle")}
                </Text>
                <IconButton
                  aria-label={t("accountMenu.close")}
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
                {t("accountMenu.switchDescription")}
              </Text>

              <Input
                placeholder={t("accountMenu.nsecPlaceholder")}
                value={nsecInput}
                onChange={(e) => {
                  setNsecInput(e.target.value);
                  setSwitchError("");
                }}
                fontFamily="mono"
                fontSize="sm"
                bg={inputBg}
                borderColor={inputBorder}
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
                  {t("accountMenu.cancel")}
                </Button>
                <Button
                  flex="1"
                  colorScheme="blue"
                  onClick={handleSwitchAccount}
                  loading={isSwitching}
                  disabled={isSwitching}
                >
                  {t("accountMenu.switchAction")}
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
            bg={modalBg}
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
                  {t("accountMenu.installTitle")}
                </Text>
                <IconButton
                  aria-label={t("accountMenu.close")}
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
                    bg={drawerBg}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={drawerBorder}
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
