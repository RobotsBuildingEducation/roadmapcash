import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useI18n } from "@/i18n/I18nProvider";
import { useMemo } from "react";

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

  const trackBg = useColorModeValue(
    "linear-gradient(to right, #6ee7b7, #fbbf24, #f87171)",
    "linear-gradient(to right, #059669, #d97706, #dc2626)",
  );
  const thumbBorder = useColorModeValue("white", "gray.900");
  const thumbShadow = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.3)",
    "0 1px 3px rgba(0,0,0,0.6)",
  );
  const labelColor = useColorModeValue("gray.500", "gray.500");
  const activeColor = useColorModeValue("gray.800", "white");
  const valueBg = useColorModeValue("gray.100", "gray.800");

  const category = useMemo(() => getCategory(value), [value]);

  const easyGoingColor = useColorModeValue("#059669", "#6ee7b7");
  const normalColor = useColorModeValue("#d97706", "#fbbf24");
  const strictColor = useColorModeValue("#dc2626", "#f87171");
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
        <Text fontSize="sm" fontWeight="semibold">
          {t("gradientSlider.label")}
        </Text>
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
    </VStack>
  );
}
