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
Current savings: $2,000

Describe your financial situation and goals in any format you like.`;

const CONTEXT_PLACEHOLDER = `Help the AI give you better advice by sharing more about your situation:

• What's driving your savings goal? (emergency fund, house down payment, vacation, etc.)
• Any debts or loans to consider?
• Are there expenses you're unwilling to cut?
• Do you have a timeline in mind?
• Any life changes coming up? (new job, moving, baby, etc.)
• What have you already tried?

The more context you provide, the more personalized your plan will be.`;

export function FinancialInput({ onGenerate, isGenerating }) {
  const [input, setInput] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [showContext, setShowContext] = useState(false);

  const handleGenerate = () => {
    if (input.trim() && onGenerate) {
      onGenerate(input, additionalContext);
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
            analyze your finances and create a personalized, opinionated plan
            with specific recommendations to help you reach your targets.
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

        <Box>
          <Button
            variant="ghost"
            size="sm"
            color="gray.400"
            _hover={{ color: "gray.200", bg: "gray.800" }}
            onClick={() => setShowContext(!showContext)}
            mb={showContext ? "3" : "0"}
          >
            {showContext ? "− Hide additional details" : "+ Add more details for a personalized plan"}
          </Button>

          {showContext && (
            <Box
              p="4"
              bg="gray.800"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.700"
            >
              <Text fontSize="sm" fontWeight="medium" color="gray.300" mb="2">
                Tell us more about your situation
              </Text>
              <Text fontSize="xs" color="gray.500" mb="3">
                This helps our AI give you specific, actionable advice tailored to your life.
              </Text>
              <Textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder={CONTEXT_PLACEHOLDER}
                minH="150px"
                bg="gray.750"
                borderColor="gray.600"
                _hover={{ borderColor: "gray.500" }}
                _focus={{
                  borderColor: "purple.400",
                  boxShadow: "0 0 0 1px var(--chakra-colors-purple-400)",
                }}
                fontSize="sm"
                resize="vertical"
              />
            </Box>
          )}
        </Box>

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
            {isGenerating ? "Creating Your Plan..." : "Generate My Plan"}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
