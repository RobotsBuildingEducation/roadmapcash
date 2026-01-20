import { Box, Text } from "@chakra-ui/react";

export function AnimatedLogo() {
  return (
    <Box display="flex" alignItems="center" gap="2">
      <Text fontSize="2xl">🐕</Text>
      <Text
        fontSize="xl"
        fontWeight="bold"
        bgGradient="to-r"
        gradientFrom="blue.400"
        gradientTo="purple.500"
        bgClip="text"
        letterSpacing="tight"
      >
        roadmap.cash
      </Text>
    </Box>
  );
}

export default AnimatedLogo;
