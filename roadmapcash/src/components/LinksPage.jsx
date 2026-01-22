import { useMemo } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { logAnalyticsEvent } from "@/database/firebaseConfig";

const parseLinks = (value) => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function LinksPage() {
  const links = useMemo(
    () => parseLinks(import.meta.env.VITE_LINKS),
    [],
  );

  const handleLaunch = (link) => {
    if (!link?.url) {
      return;
    }

    void logAnalyticsEvent("website_launch", {
      label: link.label || "unknown",
      url: link.url,
      source: "links_page",
    });

    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <VStack align="stretch" spacing="6">
      <Box>
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
          Links
        </Text>
        <Text color="gray.400" mt="2">
          Open helpful resources in a new tab.
        </Text>
      </Box>

      {links.length === 0 ? (
        <Box
          borderWidth="1px"
          borderColor="gray.800"
          borderRadius="lg"
          p={{ base: "4", md: "6" }}
          bg="gray.900"
        >
          <Text color="gray.300">
            No links are configured yet. Add VITE_LINKS to configure the list.
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" spacing="3">
          {links.map((link) => (
            <Box
              key={link.url}
              borderWidth="1px"
              borderColor="gray.800"
              borderRadius="lg"
              p={{ base: "4", md: "5" }}
              bg="gray.900"
            >
              <HStack justify="space-between" gap="4" flexWrap="wrap">
                <Box>
                  <Text fontWeight="semibold">{link.label}</Text>
                  <Text color="gray.400" fontSize="sm">
                    {link.url}
                  </Text>
                </Box>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => handleLaunch(link)}
                >
                  Launch
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
