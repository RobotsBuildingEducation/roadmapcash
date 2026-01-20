import { useState } from "react";
import { Box, VStack, Text, Textarea, Button, HStack } from "@chakra-ui/react";

const PLACEHOLDER_TEXT = `Enter your expenses and financial goals. For example:

Monthly Income: $5,000
Rent: $1,500
Utilities: $200
Groceries: $400
Transportation: $300
Entertainment: $150
Savings goal: $10,000
Emergency fund target: $5,000

Describe your financial situation and goals in any format you like.`;

export function FinancialInput({ onGenerate, isGenerating }) {
  const [input, setInput] = useState("");

  const handleGenerate = () => {
    if (input.trim() && onGenerate) {
      onGenerate(input);
    }
  };

  return (
    <Box
      p="6"
      bg="gray.900"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.800"
    >
      <VStack align="stretch" gap="4">
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb="2">
            Financial Planner
          </Text>
          <Text color="gray.400" fontSize="sm">
            Describe your expenses, income, and savings goals. Our AI will
            analyze your finances and create a visual roadmap to help you reach
            your targets.
          </Text>
        </Box>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={PLACEHOLDER_TEXT}
          minH="200px"
          bg="gray.800"
          borderColor="gray.700"
          _hover={{ borderColor: "gray.600" }}
          _focus={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
          }}
          fontSize="sm"
          resize="vertical"
        />

        <HStack justify="flex-end">
          <Button
            colorScheme="blue"
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            size="lg"
            px="8"
            bgGradient="linear(to-r, blue.400, purple.500)"
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
            }}
          >
            {isGenerating ? "Analyzing..." : "Generate Roadmap"}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
