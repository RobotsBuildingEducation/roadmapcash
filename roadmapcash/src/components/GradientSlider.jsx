import { useState } from "react";
import { Box, HStack, Text, VStack, IconButton } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useI18n } from "@/i18n/I18nProvider";
import { useMemo } from "react";
import { HiX } from "react-icons/hi";
import { LuCircleHelp } from "react-icons/lu";

const SLIDER_MIN = 0;
const SLIDER_MAX = 100;
const VALUE_MAX = 10.0;

function sliderToValue(sliderVal) {
  return Math.round((sliderVal / SLIDER_MAX) * VALUE_MAX * 10) / 10;
}

function valueToSlider(val) {
  return Math.round((val / VALUE_MAX) * SLIDER_MAX);
}

function getCategory(value) {
  if (value < 3.4) return "easyGoing";
  if (value < 6.7) return "normal";
  return "strict";
}

export function GradientSlider({ value = 5.0, onChange }) {
  const { t } = useI18n();
  const [infoOpen, setInfoOpen] = useState(false);

  const trackBg = useColorModeValue(
    "linear-gradient(to right, #22d3ee, #a3e635, #c084fc)",
    "linear-gradient(to right, #0891b2, #65a30d, #9333ea)",
  );
  const thumbBorder = useColorModeValue("white", "gray.900");
  const thumbShadow = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.3)",
    "0 1px 3px rgba(0,0,0,0.6)",
  );
  const labelColor = useColorModeValue("gray.500", "gray.500");
  const activeColor = useColorModeValue("gray.800", "white");
  const valueBg = useColorModeValue("gray.100", "gray.800");
  const modalBg = useColorModeValue("white", "gray.900");
  const modalBorder = useColorModeValue("gray.200", "gray.700");
  const modalDescColor = useColorModeValue("gray.600", "gray.400");

  const category = useMemo(() => getCategory(value), [value]);

  const easyGoingColor = useColorModeValue("#0891b2", "#22d3ee");
  const normalColor = useColorModeValue("#65a30d", "#a3e635");
  const strictColor = useColorModeValue("#7e22ce", "#c084fc");
  const categoryColors = { easyGoing: easyGoingColor, normal: normalColor, strict: strictColor };

  const sliderVal = valueToSlider(value);
  const percent = (sliderVal / SLIDER_MAX) * 100;

  const handleChange = (e) => {
    const newValue = sliderToValue(Number(e.target.value));
    onChange?.(newValue);
  };

  return (
    <VStack align="stretch" gap="2" width="100%">
      <HStack justify="space-between" align="center">
        <HStack gap="1" align="center">
          <Text fontSize="sm" fontWeight="semibold">
            {t("gradientSlider.label")}
          </Text>
          <IconButton
            aria-label={t("gradientSlider.infoButton")}
            onClick={() => setInfoOpen(true)}
            variant="ghost"
            size="xs"
            minW="auto"
            h="auto"
            p="0.5"
            color={labelColor}
            _hover={{ color: activeColor }}
          >
            <LuCircleHelp size={14} />
          </IconButton>
        </HStack>
        <HStack
          gap="1"
          bg={valueBg}
          px="2"
          py="0.5"
          borderRadius="md"
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={categoryColors[category]}
          >
            {t(`gradientSlider.${category}`)}
          </Text>
          <Text fontSize="xs" color={labelColor}>
            {value.toFixed(1)}
          </Text>
        </HStack>
      </HStack>

      <Box position="relative" px="1">
        <Box
          height="8px"
          borderRadius="full"
          background={trackBg}
        />
        <Box
          as="input"
          type="range"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={1}
          value={sliderVal}
          onChange={handleChange}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="8px"
          opacity="0"
          cursor="pointer"
          zIndex="2"
          margin="0"
          padding="0"
        />
        <Box
          position="absolute"
          top="50%"
          left={`calc(${percent}% + ${1 - percent / 50}px)`}
          transform="translate(-50%, -50%)"
          width="20px"
          height="20px"
          borderRadius="full"
          bg="white"
          border="2px solid"
          borderColor={thumbBorder}
          boxShadow={thumbShadow}
          pointerEvents="none"
          transition="left 0.05s ease-out"
          zIndex="1"
          marginTop="-4px"
        />
      </Box>

      <HStack justify="space-between" px="1">
        <Text
          fontSize="xs"
          color={category === "easyGoing" ? activeColor : labelColor}
          fontWeight={category === "easyGoing" ? "semibold" : "normal"}
        >
          {t("gradientSlider.easyGoing")}
        </Text>
        <Text
          fontSize="xs"
          color={category === "normal" ? activeColor : labelColor}
          fontWeight={category === "normal" ? "semibold" : "normal"}
        >
          {t("gradientSlider.normal")}
        </Text>
        <Text
          fontSize="xs"
          color={category === "strict" ? activeColor : labelColor}
          fontWeight={category === "strict" ? "semibold" : "normal"}
        >
          {t("gradientSlider.strict")}
        </Text>
      </HStack>

      {infoOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          zIndex="1000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p="4"
          onClick={() => setInfoOpen(false)}
        >
          <Box
            bg={modalBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={modalBorder}
            p={{ base: "5", md: "6" }}
            maxW="440px"
            w="100%"
            onClick={(e) => e.stopPropagation()}
          >
            <VStack align="stretch" gap="4">
              <HStack justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="bold">
                  {t("gradientSlider.infoTitle")}
                </Text>
                <IconButton
                  aria-label={t("gradientSlider.close")}
                  onClick={() => setInfoOpen(false)}
                  variant="ghost"
                  size="sm"
                >
                  <HiX size={18} />
                </IconButton>
              </HStack>

              <Text fontSize="sm" color={modalDescColor}>
                {t("gradientSlider.infoDescription")}
              </Text>

              <VStack align="stretch" gap="2">
                <HStack align="start" gap="2">
                  <Text fontWeight="bold" fontSize="sm" color={easyGoingColor} flexShrink={0}>
                    {t("gradientSlider.easyGoing")}
                  </Text>
                  <Text fontSize="sm" color={modalDescColor}>
                    {t("gradientSlider.infoEasyGoing")}
                  </Text>
                </HStack>
                <HStack align="start" gap="2">
                  <Text fontWeight="bold" fontSize="sm" color={normalColor} flexShrink={0}>
                    {t("gradientSlider.normal")}
                  </Text>
                  <Text fontSize="sm" color={modalDescColor}>
                    {t("gradientSlider.infoNormal")}
                  </Text>
                </HStack>
                <HStack align="start" gap="2">
                  <Text fontWeight="bold" fontSize="sm" color={strictColor} flexShrink={0}>
                    {t("gradientSlider.strict")}
                  </Text>
                  <Text fontSize="sm" color={modalDescColor}>
                    {t("gradientSlider.infoStrict")}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </Box>
      )}
    </VStack>
  );
}
