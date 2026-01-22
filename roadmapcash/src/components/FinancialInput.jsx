import { Box, VStack, Text, Textarea, Button } from "@chakra-ui/react";
import { useI18n } from "@/i18n/I18nProvider";

export function FinancialInput({
  onGenerate,
  isGenerating,
  input,
  onInputChange,
  hasSavedData,
}) {
  const { t } = useI18n();
  const handleGenerate = () => {
    if (input.trim() && onGenerate) {
      onGenerate(input);
    }
  };

  return (
    <Box
      p={{ base: "4", md: "6" }}
      bg="gray.900"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.800"
    >
      <VStack align="stretch" gap={{ base: "3", md: "4" }}>
        <Box>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mb="2">
            {t("financialInput.title")}
          </Text>
          <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>
            {t("financialInput.description")}
          </Text>
        </Box>

        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={t("financialInput.placeholder")}
          // minH={{ base: "90px", md: "90px" }}
          height="120px"
          bg="gray.800"
          borderColor="gray.700"
          _hover={{ borderColor: "gray.600" }}
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
