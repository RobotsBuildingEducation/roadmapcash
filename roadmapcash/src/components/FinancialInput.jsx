import { Box, VStack, Text, Textarea, Button } from "@chakra-ui/react";
import { useI18n } from "@/i18n/I18nProvider";
import { useColorModeValue } from "@/components/ui/color-mode";

export function FinancialInput({
  onGenerate,
  isGenerating,
  input,
  onInputChange,
  hasSavedData,
}) {
  const { t } = useI18n();
  const cardBg = useColorModeValue("white", "gray.900");
  const cardBorder = useColorModeValue("gray.200", "gray.800");
  const descriptionColor = useColorModeValue("gray.600", "gray.400");
  const textareaBg = useColorModeValue("white", "gray.800");
  const textareaBorder = useColorModeValue("gray.200", "gray.700");
  const textareaHover = useColorModeValue("gray.300", "gray.600");
  const handleGenerate = () => {
    if (input.trim() && onGenerate) {
      onGenerate(input);
    }
  };

  return (
    <Box
      p={{ base: "4", md: "6" }}
      bg={cardBg}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={cardBorder}
    >
      <VStack align="stretch" gap={{ base: "3", md: "4" }}>
        <Box>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mb="2">
            {t("financialInput.title")}
          </Text>
          <Text color={descriptionColor} fontSize={{ base: "xs", md: "sm" }}>
            {t("financialInput.description")}
          </Text>
        </Box>

        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={t("financialInput.placeholder")}
          // minH={{ base: "90px", md: "90px" }}
          height="120px"
          bg={textareaBg}
          borderColor={textareaBorder}
          _hover={{ borderColor: textareaHover }}
          _focus={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
          }}
          fontSize={"16px"}
          resize="vertical"
        />

        <Box>
          <Button
            colorScheme="blue"
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            size={{ base: "md", md: "lg" }}
            width={{ base: "100%", md: "auto" }}
            px={{ base: "4", md: "8" }}
            bgGradient="linear(to-r, blue.400, purple.500)"
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
            }}
          >
            {isGenerating
              ? t("financialInput.creatingPlan")
              : hasSavedData
                ? t("financialInput.updatePlan")
                : t("financialInput.generatePlan")}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
