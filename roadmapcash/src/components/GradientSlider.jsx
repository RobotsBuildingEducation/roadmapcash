import { useState, useRef, useCallback } from "react";
import { Box, HStack, Text, VStack, IconButton } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useI18n } from "@/i18n/I18nProvider";
import { useMemo } from "react";
import { HiX } from "react-icons/hi";
import { LuCircleHelp } from "react-icons/lu";

const VALUE_MIN = 0.0;
const VALUE_MAX = 10.0;

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function getCategory(value) {
  if (value < 3.4) return "easyGoing";
  if (value < 6.7) return "normal";
  return "strict";
}

export function GradientSlider({ value = 5.0, onChange }) {
  const { t } = useI18n();
  const [infoOpen, setInfoOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);

  const trackBg = useColorModeValue(
    "linear-gradient(to right, #22d3ee, #a3e635, #c084fc)",
    "linear-gradient(to right, #0891b2, #65a30d, #9333ea)",
  );
  const thumbBorder = useColorModeValue("white", "gray.900");
  const thumbShadow = useColorModeValue(
    "0 2px 4px rgba(0,0,0,0.25)",
    "0 2px 4px rgba(0,0,0,0.5)",
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

  const percent = ((value - VALUE_MIN) / (VALUE_MAX - VALUE_MIN)) * 100;

  const resolveValue = useCallback((clientX) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = VALUE_MIN + ratio * (VALUE_MAX - VALUE_MIN);
    const snapped = Math.round(raw * 10) / 10;
    onChange?.(snapped);
  }, [onChange]);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    e.target.setPointerCapture(e.pointerId);
    setDragging(true);
    resolveValue(e.clientX);
  }, [resolveValue]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    resolveValue(e.clientX);
  }, [dragging, resolveValue]);

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

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

      {/* Slider track — pointer events drive everything */}
      <Box
        ref={trackRef}
        position="relative"
        height="28px"
        cursor="pointer"
        touchAction="none"
        userSelect="none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        mx="1"
      >
        {/* Gradient track bar */}
        <Box
          position="absolute"
          top="50%"
          left="0"
          right="0"
          transform="translateY(-50%)"
          height="8px"
          borderRadius="full"
          background={trackBg}
          pointerEvents="none"
        />
        {/* Thumb */}
        <Box
          position="absolute"
          top="50%"
          left={`${percent}%`}
          transform="translate(-50%, -50%)"
          width="22px"
          height="22px"
          borderRadius="full"
          bg="white"
          border="2px solid"
          borderColor={thumbBorder}
          boxShadow={dragging ? `${thumbShadow}, 0 0 0 4px rgba(99,102,241,0.2)` : thumbShadow}
          pointerEvents="none"
          willChange="left"
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
