import { Box, VStack, Text, Textarea, Button, HStack } from "@chakra-ui/react";

const PLACEHOLDER_TEXT = `Enter your expenses and financial goals. For example:

Monthly Income: $5,000
Rent: $1,500
Utilities: $200
Groceries: $400
Transportation: $300
Entertainment: $150
Savings goal: $10,000
Current savings: $2,000

Describe your financial situation and goals in any format you like.`;

export function FinancialInput({ onGenerate, isGenerating, input, onInputChange, hasSavedData }) {
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
            Financial Planner
          </Text>
          <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>
            Describe your expenses, income, and savings goals. Our AI will
            analyze your finances and create a personalized, opinionated plan
            with specific recommendations to help you reach your targets.
          </Text>
        </Box>

        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={PLACEHOLDER_TEXT}
          minH={{ base: "180px", md: "200px" }}
          bg="gray.800"
          borderColor="gray.700"
          _hover={{ borderColor: "gray.600" }}
          _focus={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
          }}
          fontSize={{ base: "xs", md: "sm" }}
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
            {isGenerating ? "Creating Your Plan..." : hasSavedData ? "Update My Plan" : "Generate My Plan"}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
