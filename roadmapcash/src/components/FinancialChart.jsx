import { useMemo, useState, useEffect, useRef } from "react";
import { keyframes } from "@emotion/react";
import {
  Box,
  VStack,
  Text,
  HStack,
  Badge,
  Grid,
  GridItem,
  Button,
  Input,
  NativeSelect,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import { useI18n } from "@/i18n/I18nProvider";
import { useColorModeValue } from "@/components/ui/color-mode";

// Color palette for consistent theming
const COLORS = {
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  pink: "#ec4899",
  blue: "#3b82f6",
  expenses: [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
  ],
};

const PORTFOLIO_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#a855f7",
  "#94a3b8",
  "#f97316",
];

const STANDARD_PORTFOLIO = [
  { name: "SPY", percentage: 30 },
  { name: "Cash on hand", percentage: 25 },
  { name: "Berkshire Hathaway", percentage: 20 },
  { name: "Gold", percentage: 10 },
  { name: "Bonds", percentage: 10 },
  { name: "Bitcoin", percentage: 5 },
];

const PRIORITY_COLORS = {
  essential: {
    bg: "blue.900",
    border: "blue.700",
    text: "blue.300",
    badge: "blue",
  },
  important: {
    bg: "purple.900",
    border: "purple.700",
    text: "purple.300",
    badge: "purple",
  },
  discretionary: {
    bg: "orange.900",
    border: "orange.700",
    text: "orange.300",
    badge: "orange",
  },
};

const getDifficultyConfig = (t) => ({
  easy: { color: "green", label: t("financialChart.difficulty.easy") },
  medium: { color: "yellow", label: t("financialChart.difficulty.medium") },
  hard: { color: "red", label: t("financialChart.difficulty.hard") },
});

const getCategoryConfig = (t) => ({
  cut: {
    icon: "✂️",
    color: "red.400",
    label: t("financialChart.category.cut"),
  },
  optimize: {
    icon: "⚡",
    color: "yellow.400",
    label: t("financialChart.category.optimize"),
  },
  earn: {
    icon: "💰",
    color: "green.400",
    label: t("financialChart.category.earn"),
  },
  automate: {
    icon: "🤖",
    color: "blue.400",
    label: t("financialChart.category.automate"),
  },
  track: {
    icon: "📊",
    color: "purple.400",
    label: t("financialChart.category.track"),
  },
});

const createItemId = (prefix, index) => `${prefix}-${index}`;

const getIndexFromId = (id) => {
  if (!id) return null;
  const parts = id.split("-");
  const index = Number(parts[1]);
  return Number.isNaN(index) ? null : index;
};

// Format currency
const formatCurrency = (amount) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount?.toLocaleString() || 0}`;
};

const useChartTheme = () => ({
  surfaceBg: useColorModeValue("white", "gray.800"),
  surfaceBorder: useColorModeValue("gray.200", "gray.700"),
  elevatedBg: useColorModeValue("white", "gray.900"),
  elevatedBorder: useColorModeValue("gray.200", "gray.800"),
  insetBg: useColorModeValue("gray.50", "gray.750"),
  insetBorder: useColorModeValue("gray.200", "gray.700"),
  mutedText: useColorModeValue("gray.600", "gray.400"),
  subText: useColorModeValue("gray.600", "gray.300"),
  faintText: useColorModeValue("gray.500", "gray.500"),
  highlightText: useColorModeValue("gray.700", "gray.200"),
  hoverBorder: useColorModeValue("gray.300", "gray.600"),
  iconBg: useColorModeValue("gray.100", "gray.700"),
  successBg: useColorModeValue("green.50", "green.900"),
  successBorder: useColorModeValue("green.200", "green.700"),
  successIconBg: useColorModeValue("green.100", "green.600"),
  milestoneIconBg: useColorModeValue("gray.200", "gray.600"),
  finalIconBg: useColorModeValue("purple.100", "purple.600"),
  headerBg: useColorModeValue(
    "linear-gradient(135deg, #ffffff 0%, #f3f1ea 100%)",
    "linear-gradient(135deg, #171c22 0%, #0d0d0f 100%)",
  ),
  headerTitle: useColorModeValue("gray.900", "white"),
  headerBody: useColorModeValue("gray.600", "gray.300"),
  donutBg: useColorModeValue("#f3f1ea", "#1f2937"),
  donutLabel: useColorModeValue("#4b5563", "#9ca3af"),
  chartGrid: useColorModeValue("#e2e8f0", "#374151"),
  barBg: useColorModeValue("#e5e7eb", "#1f2937"),
  chartLabel: useColorModeValue("#4b5563", "#d1d5db"),
  axisText: useColorModeValue("#6b7280", "#6b7280"),
  inputBg: useColorModeValue("white", "gray.800"),
  inputBorder: useColorModeValue("gray.300", "gray.700"),
  tabHoverBg: useColorModeValue("gray.100", "gray.700"),
});

// Plan Header with title and overview
function PlanHeader({ plan, potentialSavings, t }) {
  if (!plan) return null;
  const theme = useChartTheme();

  return (
    <Box
      bg={theme.headerBg}
      borderRadius="xl"
      p={{ base: "4", md: "6" }}
      borderWidth="1px"
      borderColor={theme.surfaceBorder}
      position="relative"
      overflow="hidden"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top="-20"
        right="-20"
        w="150px"
        h="150px"
        bg="blue.500"
        opacity="0.1"
        borderRadius="full"
        filter="blur(40px)"
      />

      <VStack align="start" spacing="3">
        <VStack align="start" w="100%" gap={{ base: "2", md: "0" }}>
          <HStack justify="space-between" w="100%" flexWrap="wrap" gap="2">
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              color={theme.headerTitle}
            >
              {plan.title || t("financialChart.planFallbackTitle")}
            </Text>
            {potentialSavings > 0 && (
              <Badge
                colorScheme="green"
                fontSize={{ base: "xs", md: "sm" }}
                px="3"
                py="1"
                borderRadius="full"
              >
                {t("financialChart.potentialSuffix", {
                  amount: formatCurrency(potentialSavings),
                })}
              </Badge>
            )}
          </HStack>
        </VStack>

        <Text
          fontSize={{ base: "sm", md: "md" }}
          color={theme.headerBody}
          lineHeight="tall"
        >
          {plan.overview}
        </Text>

        {/* 50/30/20 Budget Breakdown */}
        {plan.monthlyBudget && (
          <Grid
            templateColumns={{ base: "repeat(3, 1fr)", md: "auto auto auto" }}
            gap={{ base: "2", md: "4" }}
            pt="2"
            w={{ base: "100%", md: "auto" }}
          >
            <Box
              bg="blue.800"
              px={{ base: "2", md: "4" }}
              py="2"
              borderRadius="lg"
              textAlign={{ base: "center", md: "left" }}
            >
              <Text
                fontSize={{ base: "2xs", md: "xs" }}
                color="blue.300"
                fontWeight="medium"
              >
                {t("financialChart.needsLabel")}
              </Text>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                color="white"
              >
                {formatCurrency(plan.monthlyBudget.needs)}
              </Text>
            </Box>
            <Box
              bg="purple.800"
              px={{ base: "2", md: "4" }}
              py="2"
              borderRadius="lg"
              textAlign={{ base: "center", md: "left" }}
            >
              <Text
                fontSize={{ base: "2xs", md: "xs" }}
                color="purple.300"
                fontWeight="medium"
              >
                {t("financialChart.wantsLabel")}
              </Text>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                color="white"
              >
                {formatCurrency(plan.monthlyBudget.wants)}
              </Text>
            </Box>
            <Box
              bg="green.800"
              px={{ base: "2", md: "4" }}
              py="2"
              borderRadius="lg"
              textAlign={{ base: "center", md: "left" }}
            >
              <Text
                fontSize={{ base: "2xs", md: "xs" }}
                color="green.300"
                fontWeight="medium"
              >
                {t("financialChart.savingsLabel")}
              </Text>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                color="white"
              >
                {formatCurrency(plan.monthlyBudget.savings)}
              </Text>
            </Box>
          </Grid>
        )}
      </VStack>
    </Box>
  );
}

// Expense Analysis with recommendations
function ExpenseAnalysis({ expenses, onSelect, t }) {
  if (!expenses || expenses.length === 0) return null;
  const theme = useChartTheme();
  const priorityConfig = useColorModeValue(
    {
      essential: {
        bg: "blue.50",
        border: "blue.200",
        text: "blue.800",
        badge: "blue",
      },
      important: {
        bg: "purple.50",
        border: "purple.200",
        text: "purple.800",
        badge: "purple",
      },
      discretionary: {
        bg: "orange.50",
        border: "orange.200",
        text: "orange.800",
        badge: "orange",
      },
    },
    PRIORITY_COLORS,
  );

  const groupedByPriority = {
    essential: expenses.filter((e) => e.priority === "essential"),
    important: expenses.filter((e) => e.priority === "important"),
    discretionary: expenses.filter((e) => e.priority === "discretionary"),
  };

  return (
    <Box
      bg={theme.surfaceBg}
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor={theme.surfaceBorder}
    >
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="semibold"
        color={theme.mutedText}
        mb={{ base: "3", md: "4" }}
        textTransform="uppercase"
        letterSpacing="wide"
      >
        {t("financialChart.expenseAnalysisTitle")}
      </Text>

      <VStack align="stretch" spacing={{ base: "3", md: "4" }}>
        {Object.entries(groupedByPriority).map(([priority, items]) => {
          if (items.length === 0) return null;
          const config = priorityConfig[priority];
          const total = items.reduce((sum, e) => sum + e.amount, 0);

          return (
            <Box key={priority}>
              <HStack mb="2" flexWrap="wrap" gap="1">
                <Badge
                  colorScheme={config.badge}
                  fontSize={{ base: "2xs", md: "xs" }}
                  textTransform="capitalize"
                >
                  {t(`financialChart.priorityLabels.${priority}`)}
                </Badge>
                <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.faintText}>
                  {t("financialChart.itemsCount", {
                    count: items.length,
                    amount: formatCurrency(total),
                  })}
                </Text>
              </HStack>

              <VStack align="stretch" spacing="2">
                {items.map((expense, index) => {
                  const expenseIndex = getIndexFromId(expense.id) ?? index;
                  return (
                    <Box
                      key={expense.id || index}
                      p={{ base: "2", md: "3" }}
                      bg={config.bg}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor={config.border}
                      borderLeftWidth="3px"
                      cursor="pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        onSelect?.(expense, "expense", expenseIndex)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelect?.(expense, "expense", expenseIndex);
                        }
                      }}
                    >
                      <HStack
                        justify="space-between"
                        mb="1"
                        flexWrap="wrap"
                        gap="1"
                      >
                        <Text
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="semibold"
                          color={config.text}
                        >
                          {expense.name}
                        </Text>
                        <Text
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="bold"
                          color={theme.highlightText}
                        >
                          {formatCurrency(expense.amount)}
                        </Text>
                      </HStack>
                      <Text
                        fontSize={{ base: "2xs", md: "xs" }}
                        color={theme.mutedText}
                        lineHeight="tall"
                      >
                        {expense.recommendation}
                      </Text>
                    </Box>
                  );
                })}
              </VStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

// Savings Strategies
function SavingsStrategies({ strategies, onSelect, t }) {
  if (!strategies || strategies.length === 0) return null;
  const theme = useChartTheme();

  const difficultyConfigMap = getDifficultyConfig(t);

  return (
    <Box
      bg={theme.surfaceBg}
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor={theme.surfaceBorder}
    >
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="semibold"
        color={theme.mutedText}
        mb={{ base: "3", md: "4" }}
        textTransform="uppercase"
        letterSpacing="wide"
      >
        {t("financialChart.savingsStrategiesTitle")}
      </Text>

      <VStack align="stretch" spacing={{ base: "2", md: "3" }}>
        {strategies.map((strategy, index) => {
          const difficultyConfig =
            difficultyConfigMap[strategy.difficulty] ||
            difficultyConfigMap.medium;
          return (
            <Box
              key={strategy.id || index}
              p={{ base: "3", md: "4" }}
              bg={theme.insetBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={theme.insetBorder}
              _hover={{
                borderColor: theme.hoverBorder,
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s"
              cursor="pointer"
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(strategy, "strategy", index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect?.(strategy, "strategy", index);
                }
              }}
            >
              <HStack justify="space-between" mb="2" flexWrap="wrap" gap="2">
                <HStack minW="0" flex="1">
                  <Box
                    w={{ base: "6", md: "8" }}
                    h={{ base: "6", md: "8" }}
                    borderRadius="lg"
                    bg="cyan.900"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize={{ base: "sm", md: "lg" }}
                    flexShrink="0"
                  >
                    {index === 0
                      ? "🎯"
                      : index === 1
                        ? "💡"
                        : index === 2
                          ? "🚀"
                          : "✨"}
                  </Box>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="semibold"
                    color={theme.highlightText}
                    isTruncated
                  >
                    {strategy.title}
                  </Text>
                </HStack>
                <Badge
                  colorScheme={difficultyConfig.color}
                  fontSize={{ base: "2xs", md: "xs" }}
                  flexShrink="0"
                >
                  {difficultyConfig.label}
                </Badge>
              </HStack>

              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={theme.mutedText}
                mb="2"
                pl={{ base: "8", md: "10" }}
              >
                {strategy.description}
              </Text>

              <HStack pl={{ base: "8", md: "10" }}>
                <Badge
                  colorScheme="green"
                  variant="subtle"
                  fontSize={{ base: "2xs", md: "xs" }}
                >
                  {t("financialChart.impactLabel", { impact: strategy.impact })}
                </Badge>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

// Action Items Checklist
function ActionItems({
  actionItems,
  weeklyCheckIn,
  onSelect,
  onSelectWeekly,
  t,
}) {
  const hasItems = actionItems && actionItems.length > 0;
  if (!hasItems && !weeklyCheckIn) return null;
  const theme = useChartTheme();

  const categoryConfigMap = getCategoryConfig(t);

  return (
    <Box
      bg={theme.surfaceBg}
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor={theme.surfaceBorder}
    >
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="semibold"
        color={theme.mutedText}
        mb={{ base: "3", md: "4" }}
        textTransform="uppercase"
        letterSpacing="wide"
      >
        {t("financialChart.actionItemsTitle")}
      </Text>

      {hasItems && (
        <VStack align="stretch" spacing="2">
          {actionItems.map((item, index) => {
            const categoryConfig =
              categoryConfigMap[item.category] || categoryConfigMap.track;
            return (
              <HStack
                key={item.id || index}
                p={{ base: "2", md: "3" }}
                bg={theme.insetBg}
                borderRadius="lg"
                spacing={{ base: "2", md: "3" }}
                borderWidth="1px"
                borderColor={theme.insetBorder}
                cursor="pointer"
                role="button"
                tabIndex={0}
                onClick={() => onSelect?.(item, "action", index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect?.(item, "action", index);
                  }
                }}
              >
                <Box
                  w={{ base: "6", md: "8" }}
                  h={{ base: "6", md: "8" }}
                  borderRadius="lg"
                  bg={theme.iconBg}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize={{ base: "sm", md: "md" }}
                  flexShrink="0"
                >
                  {categoryConfig.icon}
                </Box>
                <VStack align="start" spacing="0" flex="1" minW="0">
                  <Text fontSize={{ base: "xs", md: "sm" }} color={theme.highlightText}>
                    {item.action}
                  </Text>
                  <HStack spacing="2" flexWrap="wrap">
                    <Text
                      fontSize={{ base: "2xs", md: "xs" }}
                      color={categoryConfig.color}
                    >
                      {categoryConfig.label}
                    </Text>
                    <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.faintText}>
                      •
                    </Text>
                    <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.faintText}>
                      {item.timeframe}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            );
          })}
        </VStack>
      )}

      {weeklyCheckIn && (
        <Box
          mt={{ base: "3", md: "4" }}
          p={{ base: "2", md: "3" }}
          bg="purple.900"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="purple.700"
          cursor="pointer"
          role="button"
          tabIndex={0}
          onClick={() => onSelectWeekly?.(weeklyCheckIn, "weekly", null)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelectWeekly?.(weeklyCheckIn, "weekly", null);
            }
          }}
        >
          <HStack spacing="2" align="start">
            <Text fontSize={{ base: "md", md: "lg" }}>📅</Text>
            <VStack align="start" spacing="0" minW="0">
              <Text
                fontSize={{ base: "2xs", md: "xs" }}
                color="purple.300"
                fontWeight="medium"
              >
                {t("financialChart.weeklyCheckInLabel")}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color={theme.subText}>
                {weeklyCheckIn.text}
              </Text>
            </VStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
}

// Motivational Note
function MotivationalNote({ note, t }) {
  if (!note) return null;

  return (
    <Box
      bg="linear-gradient(135deg, #065f46 0%, #064e3b 100%)"
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor="green.700"
    >
      <HStack spacing={{ base: "2", md: "3" }} align="start">
        <Text fontSize={{ base: "xl", md: "2xl" }}>💪</Text>
        <VStack align="start" spacing="1" minW="0">
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="semibold"
            color="green.300"
          >
            {t("financialChart.coachSays")}
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="white"
            lineHeight="tall"
          >
            {note}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

// Overview Chart - Donut showing income allocation
function OverviewChart({ income, expenses, t }) {
  const total = income || 1;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsAmount = Math.max(0, income - totalExpenses);
  const theme = useChartTheme();

  const segments = useMemo(() => {
    const result = [];
    let currentAngle = -90;

    expenses.forEach((expense, index) => {
      const percentage = (expense.amount / total) * 100;
      const angle = (percentage / 100) * 360;
      result.push({
        name: expense.name,
        amount: expense.amount,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: COLORS.expenses[index % COLORS.expenses.length],
      });
      currentAngle += angle;
    });

    if (savingsAmount > 0) {
      const percentage = (savingsAmount / total) * 100;
      const angle = (percentage / 100) * 360;
      result.push({
        name: t("financialChart.savingsLabelShort"),
        amount: savingsAmount,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: COLORS.success,
        isSavings: true,
      });
    }

    return result;
  }, [expenses, total, savingsAmount]);

  const describeArc = (cx, cy, radius, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  const polarToCartesian = (cx, cy, radius, angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const savingsPercentage =
    income > 0 ? ((savingsAmount / income) * 100).toFixed(0) : 0;

  return (
    <Box
      bg={theme.surfaceBg}
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor={theme.surfaceBorder}
    >
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="semibold"
        color={theme.mutedText}
        mb={{ base: "3", md: "4" }}
        textTransform="uppercase"
        letterSpacing="wide"
      >
        {t("financialChart.incomeAllocation")}
      </Text>

      <VStack spacing={{ base: "4", md: "6" }} align="stretch">
        <HStack
          spacing={{ base: "4", md: "6" }}
          align="center"
          justify="center"
          flexWrap={{ base: "wrap", md: "nowrap" }}
        >
          <Box position="relative" flexShrink="0">
            <svg width="140" height="140" viewBox="0 0 160 160">
              {segments.map((segment, index) => (
                <path
                  key={index}
                  d={describeArc(
                    80,
                    80,
                    60,
                    segment.startAngle,
                    segment.endAngle - 0.5,
                  )}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="20"
                  strokeLinecap="round"
                  style={{
                    filter: segment.isSavings
                      ? "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))"
                      : "none",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
              <circle cx="80" cy="80" r="45" fill={theme.donutBg} />
              <text
                x="80"
                y="72"
                textAnchor="middle"
                fill="#10b981"
                fontSize="24"
                fontWeight="bold"
              >
                {savingsPercentage}%
              </text>
              <text
                x="80"
                y="92"
                textAnchor="middle"
                fill={theme.donutLabel}
                fontSize="11"
              >
                {t("financialChart.savedLabel")}
              </text>
            </svg>
          </Box>

          <VStack align="start" spacing="2" flex="1" minW="0">
            {segments.map((segment, index) => (
              <HStack key={index} justify="space-between" w="100%">
                <HStack spacing="2" minW="0" flex="1">
                  <Box
                    w="3"
                    h="3"
                    borderRadius="full"
                    bg={segment.color}
                    flexShrink="0"
                  />
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color={theme.subText}
                    isTruncated
                  >
                    {segment.name}
                  </Text>
                </HStack>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color={segment.isSavings ? "green.400" : theme.mutedText}
                  fontWeight="medium"
                  flexShrink="0"
                >
                  {formatCurrency(segment.amount)}
                </Text>
              </HStack>
            ))}
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}

// Investment Portfolio - standard allocation with charts
function InvestmentPortfolio({
  allocations,
  qualitySummary,
  onCustomize,
  onQualityCheck,
  isUpdating,
  portfolioAction,
  t,
}) {
  const theme = useChartTheme();
  const portfolio = allocations?.length ? allocations : STANDARD_PORTFOLIO;
  const total = portfolio.reduce((sum, item) => sum + item.percentage, 0);

  const segments = useMemo(() => {
    const result = [];
    let currentAngle = -90;

    portfolio.forEach((item, index) => {
      const percentage = total ? (item.percentage / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      result.push({
        ...item,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length],
      });
      currentAngle += angle;
    });

    return result;
  }, [portfolio, total]);

  const describeArc = (cx, cy, radius, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  const polarToCartesian = (cx, cy, radius, angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  return (
    <Box
      bg={theme.surfaceBg}
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor={theme.surfaceBorder}
    >
      <VStack align="stretch" spacing={{ base: "3", md: "4" }}>
        <Box>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="semibold"
            color={theme.mutedText}
            textTransform="uppercase"
            letterSpacing="wide"
          >
            {t("financialChart.portfolio.title")}
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} color={theme.subText}>
            {t("financialChart.portfolio.subtitle")}
          </Text>
        </Box>

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4">
          <GridItem>
            <VStack align="center" spacing="3">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color={theme.mutedText}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t("financialChart.portfolio.allocationChart")}
              </Text>
              <Box position="relative">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  {segments.map((segment, index) => (
                    <path
                      key={`${segment.name}-${index}`}
                      d={describeArc(
                        80,
                        80,
                        60,
                        segment.startAngle,
                        segment.endAngle - 0.5,
                      )}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="22"
                      strokeLinecap="round"
                    />
                  ))}
                  <circle cx="80" cy="80" r="45" fill={theme.donutBg} />
                  <text
                    x="80"
                    y="78"
                    textAnchor="middle"
                    fill={theme.headerTitle}
                    fontSize="18"
                    fontWeight="bold"
                  >
                    {total}%
                  </text>
                  <text
                    x="80"
                    y="98"
                    textAnchor="middle"
                    fill={theme.donutLabel}
                    fontSize="11"
                  >
                    {t("financialChart.portfolio.totalLabel")}
                  </text>
                </svg>
              </Box>
              <HStack spacing="2" flexWrap="wrap" justify="center">
                <Button
                  size="xs"
                  variant="outline"
                  borderColor={theme.surfaceBorder}
                  onClick={onCustomize}
                  isDisabled={!onCustomize || isUpdating}
                >
                  {isUpdating && portfolioAction === "customize" ? (
                    <Spinner size="xs" />
                  ) : (
                    t("financialChart.portfolio.customizeButton")
                  )}
                </Button>
                <Button
                  size="xs"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={onQualityCheck}
                  isDisabled={!onQualityCheck || isUpdating}
                >
                  {isUpdating && portfolioAction === "quality" ? (
                    <Spinner size="xs" />
                  ) : (
                    t("financialChart.portfolio.qualityButton")
                  )}
                </Button>
              </HStack>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack align="stretch" spacing="3">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color={theme.mutedText}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t("financialChart.portfolio.breakdownTitle")}
              </Text>
              {segments.map((segment) => (
                <VStack key={segment.name} align="stretch" spacing="1">
                  <HStack justify="space-between">
                    <HStack spacing="2" minW="0">
                      <Box
                        w="3"
                        h="3"
                        borderRadius="full"
                        bg={segment.color}
                        flexShrink="0"
                      />
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        color={theme.subText}
                        isTruncated
                      >
                        {segment.name}
                      </Text>
                    </HStack>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color={theme.mutedText}
                      fontWeight="medium"
                    >
                      {Math.round(segment.percentage)}%
                    </Text>
                  </HStack>
                  <Box
                    h="2"
                    bg={theme.barBg}
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Box
                      h="100%"
                      w={`${segment.percentage}%`}
                      bg={segment.color}
                    />
                  </Box>
                </VStack>
              ))}
            </VStack>
          </GridItem>
        </Grid>

        <Text fontSize="xs" color={theme.faintText}>
          {t("financialChart.portfolio.note")}
        </Text>

        {(qualitySummary || (isUpdating && portfolioAction === "quality")) && (
          <Box
            bg={theme.insetBg}
            borderRadius="lg"
            p="3"
            borderWidth="1px"
            borderColor={theme.insetBorder}
          >
            <Text fontSize="2xs" color={theme.faintText} mb="1">
              {t("financialChart.portfolio.qualityTitle")}
            </Text>
            <Text fontSize="sm" color={theme.subText}>
              {qualitySummary ||
                t("financialChart.portfolio.qualityLoading")}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

// Expense Bar Chart - Horizontal bars comparing expenses
function ExpenseBarChart({ expenses, income, t }) {
  if (!expenses || expenses.length === 0) return null;
  const theme = useChartTheme();

  const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsAmount = Math.max(0, (income || 0) - totalExpenses);
  const maxAmount = Math.max(
    ...expenses.map((e) => e.amount),
    savingsAmount,
    1,
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "essential":
        return "#3b82f6"; // blue
      case "important":
        return "#8b5cf6"; // purple
      case "discretionary":
        return "#f97316"; // orange
      default:
        return "#6b7280"; // gray
    }
  };

  // Calculate total items including savings bar
  const totalItems =
    sortedExpenses.length + (savingsAmount > 0 && income > 0 ? 1 : 0);
  const barHeight = 22;
  const barGap = 6;
  const chartHeight = Math.max(80, totalItems * (barHeight + barGap) + 35);
  const labelWidth = 90;
  const amountWidth = 50;
  const chartWidth = 350;
  const barAreaWidth = chartWidth - labelWidth - amountWidth - 10;

  return (
    <Box
      bg={theme.surfaceBg}
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor={theme.surfaceBorder}
    >
      <HStack
        justify="space-between"
        mb={{ base: "3", md: "4" }}
        flexWrap="wrap"
        gap="2"
      >
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="semibold"
          color={theme.mutedText}
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {t("financialChart.expenseBreakdown")}
        </Text>
        <HStack spacing="3" flexWrap="wrap">
          <HStack spacing="1">
            <Box w="2" h="2" borderRadius="full" bg="#3b82f6" />
            <Text fontSize="2xs" color={theme.faintText}>
              {t("financialChart.priorityLabels.essential")}
            </Text>
          </HStack>
          <HStack spacing="1">
            <Box w="2" h="2" borderRadius="full" bg="#8b5cf6" />
            <Text fontSize="2xs" color={theme.faintText}>
              {t("financialChart.priorityLabels.important")}
            </Text>
          </HStack>
          <HStack spacing="1">
            <Box w="2" h="2" borderRadius="full" bg="#f97316" />
            <Text fontSize="2xs" color={theme.faintText}>
              {t("financialChart.priorityLabels.discretionary")}
            </Text>
          </HStack>
        </HStack>
      </HStack>

      <Box overflowX="auto">
        <svg
          width="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ minWidth: "280px" }}
        >
          {/* Background grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={labelWidth + ratio * barAreaWidth}
              y1={10}
              x2={labelWidth + ratio * barAreaWidth}
              y2={chartHeight - 30}
              stroke={theme.chartGrid}
              strokeWidth="1"
              strokeDasharray={i === 0 ? "0" : "4,4"}
            />
          ))}

          {/* Expense bars */}
          {sortedExpenses.map((expense, index) => {
            const barWidth = Math.min(
              (expense.amount / maxAmount) * barAreaWidth,
              barAreaWidth,
            );
            const y = 20 + index * (barHeight + barGap);
            const color = getPriorityColor(expense.priority);

            return (
              <g key={index}>
                {/* Label */}
                <text
                  x={labelWidth - 4}
                  y={y + barHeight / 2 + 3}
                  textAnchor="end"
                  fill={theme.chartLabel}
                  fontSize="9"
                  fontWeight="500"
                  style={{ fontSize: "6px" }}
                >
                  {expense.name.length > 24
                    ? expense.name.substring(0, 12) + "..."
                    : expense.name}
                </text>

                {/* Bar background */}
                <rect
                  x={labelWidth}
                  y={y}
                  width={barAreaWidth}
                  height={barHeight}
                  fill={theme.barBg}
                  rx="4"
                />

                {/* Bar fill */}
                <rect
                  x={labelWidth}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx="4"
                  opacity="0.85"
                />

                {/* Amount label */}
                <text
                  x={labelWidth + barAreaWidth + 4}
                  y={y + barHeight / 2 + 3}
                  textAnchor="start"
                  fill={theme.donutLabel}
                  fontSize="9"
                  fontWeight="600"
                  style={{ fontSize: "9px" }}
                >
                  {formatCurrency(expense.amount)}
                </text>
              </g>
            );
          })}

          {/* Savings bar (if positive) */}
          {savingsAmount > 0 && income > 0 && (
            <g>
              <text
                x={labelWidth - 4}
                y={
                  20 +
                  sortedExpenses.length * (barHeight + barGap) +
                  barHeight / 2 +
                  3
                }
                textAnchor="end"
                fill="#10b981"
                fontSize="9px"
                fontWeight="600"
                style={{ fontSize: "6px" }}
              >
                {t("financialChart.savingsLabelShort")}
              </text>

              <rect
                x={labelWidth}
                y={20 + sortedExpenses.length * (barHeight + barGap)}
                width={barAreaWidth}
                height={barHeight}
                fill={theme.barBg}
                rx="4"
              />

              <rect
                x={labelWidth}
                y={20 + sortedExpenses.length * (barHeight + barGap)}
                width={Math.min(
                  (savingsAmount / maxAmount) * barAreaWidth,
                  barAreaWidth,
                )}
                height={barHeight}
                fill="#10b981"
                rx="4"
                opacity="0.85"
              />

              <text
                x={labelWidth + barAreaWidth + 4}
                y={
                  20 +
                  sortedExpenses.length * (barHeight + barGap) +
                  barHeight / 2 +
                  3
                }
                textAnchor="start"
                fill="#10b981"
                fontSize="9"
                fontWeight="600"
                style={{ fontSize: "9px" }}
              >
                {formatCurrency(savingsAmount)}
              </text>
            </g>
          )}

          {/* X-axis labels */}
          {[0, 0.5, 1].map((ratio, i) => (
            <text
              key={i}
              x={labelWidth + ratio * barAreaWidth}
              y={chartHeight - 6}
              textAnchor="middle"
              fill={theme.axisText}
              fontSize="8"
              style={{ fontSize: "9px" }}
            >
              {formatCurrency(maxAmount * ratio)}
            </text>
          ))}
        </svg>
      </Box>

      {/* Summary footer */}
      <HStack
        justify="space-between"
        mt="3"
        pt="3"
        borderTopWidth="1px"
        borderColor={theme.surfaceBorder}
        flexWrap="wrap"
        gap="2"
      >
        <VStack align="start" spacing="0">
          <Text fontSize="2xs" color={theme.faintText}>
            {t("financialChart.totalExpenses")}
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="red.400">
            {formatCurrency(totalExpenses)}
          </Text>
        </VStack>
        {income > 0 && (
          <VStack align="end" spacing="0">
            <Text fontSize="2xs" color={theme.faintText}>
              {t("financialChart.percentOfIncome")}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={totalExpenses / income > 0.8 ? "red.400" : "green.400"}
            >
              {((totalExpenses / income) * 100).toFixed(0)}%
            </Text>
          </VStack>
        )}
      </HStack>
    </Box>
  );
}

// Monthly Projection Chart
function MonthlyChart({
  monthlySavings,
  currentSavings,
  savingsGoal,
  potentialSavings,
  t,
}) {
  const projectionMonths = 24;
  const theme = useChartTheme();

  // Calculate both current path and optimized path
  const projectionData = useMemo(() => {
    const data = [];
    let balance = currentSavings || 0;
    let optimizedBalance = currentSavings || 0;
    const optimizedMonthlySavings = monthlySavings + (potentialSavings || 0);

    for (let month = 0; month <= projectionMonths; month++) {
      data.push({
        month,
        balance,
        optimizedBalance,
        label:
          month === 0
            ? t("financialChart.timeline.now")
            : month === 12
              ? t("financialChart.timeline.yearOne")
              : month === 24
                ? t("financialChart.timeline.yearTwo")
                : "",
      });
      balance += Math.max(0, monthlySavings);
      optimizedBalance += Math.max(0, optimizedMonthlySavings);
    }

    return data;
  }, [monthlySavings, currentSavings, potentialSavings]);

  const maxBalance = Math.max(
    ...projectionData.map((d) => Math.max(d.balance, d.optimizedBalance)),
    savingsGoal || 0,
    1,
  );
  const chartWidth = 320;
  const chartHeight = 160;
  const padding = { top: 10, right: 10, bottom: 25, left: 10 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const generatePath = (key) => {
    const points = projectionData.map((d, i) => {
      const x = padding.left + (i / projectionMonths) * innerWidth;
      const y = padding.top + innerHeight - (d[key] / maxBalance) * innerHeight;
      return `${x},${y}`;
    });
    return `M${points[0]} ${points
      .slice(1)
      .map((p) => `L${p}`)
      .join(" ")}`;
  };

  const generateAreaPath = (key) => {
    const points = projectionData.map((d, i) => {
      const x = padding.left + (i / projectionMonths) * innerWidth;
      const y = padding.top + innerHeight - (d[key] / maxBalance) * innerHeight;
      return `${x},${y}`;
    });
    const bottomRight = `${padding.left + innerWidth},${padding.top + innerHeight}`;
    const bottomLeft = `${padding.left},${padding.top + innerHeight}`;
    return `M${points[0]} ${points
      .slice(1)
      .map((p) => `L${p}`)
      .join(" ")} L${bottomRight} L${bottomLeft} Z`;
  };

  const goalY = savingsGoal
    ? padding.top + innerHeight - (savingsGoal / maxBalance) * innerHeight
    : null;

  const endBalance = projectionData[projectionData.length - 1].balance;
  const optimizedEndBalance =
    projectionData[projectionData.length - 1].optimizedBalance;

  return (
    <Box
      bg={theme.surfaceBg}
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor={theme.surfaceBorder}
    >
      <HStack
        justify="space-between"
        mb={{ base: "2", md: "3" }}
        flexWrap="wrap"
        gap="2"
      >
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="semibold"
          color={theme.mutedText}
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {t("financialChart.growthProjection")}
        </Text>
        <Badge colorScheme={monthlySavings > 0 ? "green" : "red"} fontSize="xs">
          {monthlySavings >= 0 ? "+" : ""}
          {t("financialChart.perMonthSuffix", {
            amount: formatCurrency(monthlySavings),
          })}
        </Badge>
      </HStack>

      <svg
        width="100%"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + innerHeight * (1 - ratio)}
            x2={padding.left + innerWidth}
            y2={padding.top + innerHeight * (1 - ratio)}
            stroke={theme.chartGrid}
            strokeWidth="1"
            strokeDasharray={i === 0 ? "0" : "4,4"}
          />
        ))}

        {/* Goal line */}
        {goalY && goalY > padding.top && (
          <>
            <line
              x1={padding.left}
              y1={goalY}
              x2={padding.left + innerWidth}
              y2={goalY}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <text
              x={padding.left + 5}
              y={goalY - 5}
              fill="#f59e0b"
              fontSize="10"
              fontWeight="bold"
              style={{ fontSize: "9px" }}
            >
              {t("financialChart.goalLabel")}
            </text>
          </>
        )}

        {/* Optimized path (if there's potential savings) */}
        {potentialSavings > 0 && (
          <>
            <path
              d={generateAreaPath("optimizedBalance")}
              fill="url(#optimizedGradient)"
            />
            <path
              d={generatePath("optimizedBalance")}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
          </>
        )}

        {/* Current path */}
        <path d={generateAreaPath("balance")} fill="url(#currentGradient)" />
        <path
          d={generatePath("balance")}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* End point */}
        <circle
          cx={padding.left + innerWidth}
          cy={
            padding.top + innerHeight - (endBalance / maxBalance) * innerHeight
          }
          r="5"
          fill="#06b6d4"
        />

        {/* X-axis labels */}
        {projectionData
          .filter((d) => d.label)
          .map((d, i) => (
            <text
              key={i}
              x={padding.left + (d.month / projectionMonths) * innerWidth}
              y={chartHeight - 5}
              textAnchor="middle"
              fill={theme.donutLabel}
              fontSize="10"
              style={{ fontSize: "9px" }}
            >
              {d.label}
            </text>
          ))}
      </svg>

      <HStack justify="space-between" mt="2" flexWrap="wrap" gap="2">
        <VStack align="start" spacing="0">
          <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.faintText}>
            {t("financialChart.currentPath")}
          </Text>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="bold"
            color="cyan.400"
          >
            {t("financialChart.yearsLabel", {
              amount: formatCurrency(endBalance),
            })}
          </Text>
        </VStack>
        {potentialSavings > 0 && (
          <VStack align="end" spacing="0">
            <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.faintText}>
              {t("financialChart.withPlan")}
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="bold"
              color="green.400"
            >
              {t("financialChart.yearsLabel", {
                amount: formatCurrency(optimizedEndBalance),
              })}
            </Text>
          </VStack>
        )}
      </HStack>
    </Box>
  );
}

// Bird's Eye View - Timeline
function BirdsEyeView({
  currentSavings,
  savingsGoal,
  monthlySavings,
  expenses,
  t,
}) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const theme = useChartTheme();

  const milestones = useMemo(() => {
    if (!savingsGoal || monthlySavings <= 0) return [];

    const monthsToGoal = Math.ceil(
      (savingsGoal - (currentSavings || 0)) / monthlySavings,
    );
    const milestonePoints = [];

    const emergencyFund = totalExpenses * 3;
    if (emergencyFund > (currentSavings || 0) && emergencyFund < savingsGoal) {
      const monthsToEmergency = Math.ceil(
        (emergencyFund - (currentSavings || 0)) / monthlySavings,
      );
      milestonePoints.push({
        label: t("financialChart.milestone.emergencyFund"),
        sublabel: t("financialChart.milestone.emergencyFundSub"),
        amount: emergencyFund,
        months: monthsToEmergency,
        icon: "shield",
      });
    }

    const quarter = savingsGoal * 0.25;
    if (quarter > (currentSavings || 0)) {
      const monthsTo25 = Math.ceil(
        (quarter - (currentSavings || 0)) / monthlySavings,
      );
      milestonePoints.push({
        label: t("financialChart.milestone.progress25"),
        amount: quarter,
        months: monthsTo25,
        icon: "flag",
      });
    }

    const half = savingsGoal * 0.5;
    if (half > (currentSavings || 0)) {
      const monthsTo50 = Math.ceil(
        (half - (currentSavings || 0)) / monthlySavings,
      );
      milestonePoints.push({
        label: t("financialChart.milestone.halfway"),
        amount: half,
        months: monthsTo50,
        icon: "star",
      });
    }

    milestonePoints.push({
      label: t("financialChart.milestone.goalReached"),
      amount: savingsGoal,
      months: monthsToGoal,
      icon: "trophy",
      isFinal: true,
    });

    return milestonePoints.sort((a, b) => a.months - b.months).slice(0, 4);
  }, [currentSavings, savingsGoal, monthlySavings, totalExpenses]);

  const progressPercent = savingsGoal
    ? Math.min(((currentSavings || 0) / savingsGoal) * 100, 100)
    : 0;

  const monthsToGoal =
    monthlySavings > 0 && savingsGoal
      ? Math.ceil((savingsGoal - (currentSavings || 0)) / monthlySavings)
      : null;

  return (
    <Box
      bg={theme.surfaceBg}
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor={theme.surfaceBorder}
    >
      <HStack
        justify="space-between"
        mb={{ base: "3", md: "4" }}
        flexWrap="wrap"
        gap="2"
      >
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="semibold"
          color={theme.mutedText}
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {t("financialChart.roadmapTitle")}
        </Text>
        {monthsToGoal && monthsToGoal > 0 && (
          <Badge colorScheme="purple" fontSize="xs">
            {monthsToGoal < 12
              ? t("financialChart.monthsToGo", { count: monthsToGoal })
              : t("financialChart.yearsToGo", {
                  count: (monthsToGoal / 12).toFixed(1),
                })}
          </Badge>
        )}
      </HStack>

      <Box mb="5">
        <HStack justify="space-between" mb="2">
          <Text fontSize="xs" color={theme.faintText}>
            {t("financialChart.currentProgress")}
          </Text>
          <Text fontSize="xs" color="green.400" fontWeight="bold">
            {progressPercent.toFixed(1)}%
          </Text>
        </HStack>
        <Box
          position="relative"
          h="3"
          bg={theme.insetBg}
          borderRadius="full"
          overflow="hidden"
        >
          <Box
            position="absolute"
            left="0"
            top="0"
            h="100%"
            w={`${progressPercent}%`}
            bgGradient="linear(to-r, cyan.500, green.500)"
            borderRadius="full"
            transition="width 0.5s ease"
          />
          {milestones.map((m, i) => {
            const position = savingsGoal ? (m.amount / savingsGoal) * 100 : 0;
            return (
              <Box
                key={i}
                position="absolute"
                left={`${position}%`}
                top="50%"
                transform="translate(-50%, -50%)"
                w="2"
                h="2"
                bg={position <= progressPercent ? "green.400" : theme.faintText}
                borderRadius="full"
              />
            );
          })}
        </Box>
      </Box>

      {milestones.length > 0 && (
        <VStack align="stretch" spacing={{ base: "2", md: "3" }}>
          {milestones.map((milestone, index) => {
            const isReached = (currentSavings || 0) >= milestone.amount;
            return (
              <HStack
                key={index}
                p={{ base: "2", md: "3" }}
                bg={isReached ? theme.successBg : theme.insetBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={
                  isReached
                    ? theme.successBorder
                    : milestone.isFinal
                      ? "purple.400"
                      : theme.insetBorder
                }
                opacity={isReached ? 0.7 : 1}
              >
                <Box
                  w={{ base: "8", md: "10" }}
                  h={{ base: "8", md: "10" }}
                  borderRadius="lg"
                  bg={
                    isReached
                      ? theme.successIconBg
                      : milestone.isFinal
                        ? theme.finalIconBg
                        : theme.milestoneIconBg
                  }
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink="0"
                >
                  <Text fontSize={{ base: "md", md: "lg" }}>
                    {milestone.icon === "shield" && "🛡️"}
                    {milestone.icon === "flag" && "🚩"}
                    {milestone.icon === "star" && "⭐"}
                    {milestone.icon === "trophy" && "🏆"}
                  </Text>
                </Box>
                <VStack align="start" spacing="0" flex="1" minW="0">
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="semibold"
                    color={isReached ? "green.300" : theme.highlightText}
                    isTruncated
                  >
                    {milestone.label}
                  </Text>
                  <Text
                    fontSize={{ base: "2xs", md: "xs" }}
                    color={theme.faintText}
                    isTruncated
                  >
                    {milestone.sublabel || formatCurrency(milestone.amount)}
                  </Text>
                </VStack>
                <VStack align="end" spacing="0" flexShrink="0">
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="bold"
                    color={
                      isReached
                        ? "green.400"
                        : milestone.isFinal
                          ? "purple.400"
                          : theme.mutedText
                    }
                  >
                    {isReached
                      ? t("financialChart.doneLabel")
                      : t("financialChart.monthsShort", {
                          count: milestone.months,
                        })}
                  </Text>
                  {!isReached && (
                    <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.faintText}>
                      {formatCurrency(milestone.amount)}
                    </Text>
                  )}
                </VStack>
              </HStack>
            );
          })}
        </VStack>
      )}

      {(!savingsGoal || monthlySavings <= 0) && (
        <Box p="4" bg={theme.insetBg} borderRadius="lg" textAlign="center">
          <Text fontSize="sm" color={theme.mutedText}>
            {!savingsGoal
              ? t("financialChart.noGoalMessage")
              : t("financialChart.increaseSavingsMessage")}
          </Text>
        </Box>
      )}
    </Box>
  );
}

// Key Metrics Summary
function MetricsSummary({
  income,
  expenses,
  monthlySavings,
  savingsGoal,
  currentSavings,
  t,
}) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsRate =
    income > 0 ? ((monthlySavings / income) * 100).toFixed(0) : 0;
  const theme = useChartTheme();

  return (
    <Grid
      templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
      gap={{ base: "2", md: "3" }}
    >
      <GridItem>
        <Box
          bg={theme.surfaceBg}
          borderRadius="xl"
          p={{ base: "3", md: "4" }}
          borderWidth="1px"
          borderColor={theme.surfaceBorder}
          textAlign="center"
        >
          <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.faintText} mb="1">
            {t("financialChart.metrics.monthlyIncome")}
          </Text>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            color="green.400"
          >
            {formatCurrency(income)}
          </Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box
          bg={theme.surfaceBg}
          borderRadius="xl"
          p={{ base: "3", md: "4" }}
          borderWidth="1px"
          borderColor={theme.surfaceBorder}
          textAlign="center"
        >
          <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.faintText} mb="1">
            {t("financialChart.metrics.expenses")}
          </Text>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            color="red.400"
          >
            {formatCurrency(totalExpenses)}
          </Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box
          bg={theme.surfaceBg}
          borderRadius="xl"
          p={{ base: "3", md: "4" }}
          borderWidth="1px"
          borderColor={theme.surfaceBorder}
          textAlign="center"
        >
          <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.faintText} mb="1">
            {t("financialChart.metrics.youSave")}
          </Text>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            color={monthlySavings >= 0 ? "cyan.400" : "red.400"}
          >
            {formatCurrency(Math.abs(monthlySavings))}
          </Text>
          <Text
            fontSize={{ base: "2xs", md: "xs" }}
            color={monthlySavings >= 0 ? "cyan.600" : "red.600"}
          >
            {t("financialChart.metrics.rateLabel", { rate: savingsRate })}
          </Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box
          bg={theme.surfaceBg}
          borderRadius="xl"
          p={{ base: "3", md: "4" }}
          borderWidth="1px"
          borderColor={theme.surfaceBorder}
          textAlign="center"
        >
          <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.faintText} mb="1">
            {t("financialChart.metrics.goalProgress")}
          </Text>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            color="purple.400"
          >
            {savingsGoal ? formatCurrency(currentSavings || 0) : "--"}
          </Text>
          {savingsGoal && (
            <Text fontSize={{ base: "2xs", md: "xs" }} color="purple.600">
              {t("financialChart.metrics.ofGoal", {
                amount: formatCurrency(savingsGoal),
              })}
            </Text>
          )}
        </Box>
      </GridItem>
    </Grid>
  );
}

// Main FinancialChart component
export function FinancialChart({ data, onUpdate, onItemUpdate, isUpdating }) {
  const { t } = useI18n();
  const theme = useChartTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [draftIncome, setDraftIncome] = useState(0);
  const [draftSavingsGoal, setDraftSavingsGoal] = useState("");
  const [draftCurrentSavings, setDraftCurrentSavings] = useState("");
  const [draftExpenses, setDraftExpenses] = useState([]);
  const [updateNotes, setUpdateNotes] = useState("");
  const [showUpdateFlash, setShowUpdateFlash] = useState(false);
  const previousUpdatingRef = useRef(false);
  const [interactiveStrategies, setInteractiveStrategies] = useState([]);
  const [interactiveActions, setInteractiveActions] = useState([]);
  const [interactiveExpenses, setInteractiveExpenses] = useState([]);
  const [interactiveWeeklyCheckIn, setInteractiveWeeklyCheckIn] =
    useState(null);
  const [interaction, setInteraction] = useState(null);
  const [interactionIndex, setInteractionIndex] = useState(null);
  const [interactionAction, setInteractionAction] = useState("");
  const [portfolioAllocations, setPortfolioAllocations] =
    useState(STANDARD_PORTFOLIO);
  const [portfolioDraft, setPortfolioDraft] = useState(STANDARD_PORTFOLIO);
  const [portfolioAction, setPortfolioAction] = useState("");
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [portfolioCustomized, setPortfolioCustomized] = useState(false);

  if (!data) return null;

  const expenses = data.expenses || [];
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlySavings = (data.income || 0) - totalExpenses;
  const plan = data.plan;

  useEffect(() => {
    setDraftIncome(data.income || 0);
    setDraftSavingsGoal(data.savingsGoal ?? "");
    setDraftCurrentSavings(data.currentSavings ?? "");
    setDraftExpenses(
      expenses.map((expense) => ({
        name: expense.name,
        amount: expense.amount,
        priority: expense.priority || "important",
      })),
    );
  }, [data.income, data.savingsGoal, data.currentSavings, expenses]);

  useEffect(() => {
    setInteractiveStrategies(
      (plan?.strategies || []).map((strategy, index) => ({
        ...strategy,
        id: createItemId("strategy", index),
      })),
    );
    setInteractiveActions(
      (plan?.actionItems || []).map((item, index) => ({
        ...item,
        id: createItemId("action", index),
      })),
    );
    setInteractiveWeeklyCheckIn(
      plan?.weeklyCheckIn
        ? {
            id: "weekly-checkin",
            text: plan.weeklyCheckIn,
          }
        : null,
    );
    setInteractiveExpenses(
      expenses.map((expense, index) => ({
        ...expense,
        id: createItemId("expense", index),
      })),
    );
  }, [expenses, plan]);

  useEffect(() => {
    if (!portfolioCustomized) return;
    if (plan?.portfolio?.allocations?.length) {
      setPortfolioAllocations(plan.portfolio.allocations);
    }
  }, [plan, portfolioCustomized]);

  useEffect(() => {
    if (previousUpdatingRef.current && !isUpdating) {
      setShowUpdateFlash(true);
      const timeout = setTimeout(() => setShowUpdateFlash(false), 1400);
      setInteractionAction("");
      setPortfolioAction("");
      previousUpdatingRef.current = isUpdating;
      return () => clearTimeout(timeout);
    }
    previousUpdatingRef.current = isUpdating;
    return undefined;
  }, [isUpdating]);

  useEffect(() => {
    if (!interaction) return;

    const findUpdatedItem = () => {
      if (interaction.type === "strategy") {
        return interactionIndex !== null
          ? interactiveStrategies[interactionIndex]
          : null;
      }
      if (interaction.type === "action") {
        return interactionIndex !== null
          ? interactiveActions[interactionIndex]
          : null;
      }
      if (interaction.type === "expense") {
        return interactionIndex !== null
          ? interactiveExpenses[interactionIndex]
          : null;
      }
      if (interaction.type === "weekly") {
        return interactiveWeeklyCheckIn;
      }
      return null;
    };

    const updatedItem = findUpdatedItem();
    if (updatedItem && updatedItem !== interaction.item) {
      setInteraction((prev) => (prev ? { ...prev, item: updatedItem } : prev));
    }
  }, [
    interaction,
    interactionIndex,
    interactiveStrategies,
    interactiveActions,
    interactiveExpenses,
    interactiveWeeklyCheckIn,
  ]);

  const updateExpenseField = (index, field, value) => {
    setDraftExpenses((prev) =>
      prev.map((expense, i) =>
        i === index ? { ...expense, [field]: value } : expense,
      ),
    );
  };

  const handleAddExpense = () => {
    setDraftExpenses((prev) => [
      ...prev,
      { name: "", amount: "", priority: "important" },
    ]);
  };

  const handleRemoveExpense = (index) => {
    setDraftExpenses((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSummary = useMemo(() => {
    const lines = [];
    const incomeValue = Number(draftIncome);
    const goalValue =
      draftSavingsGoal === "" || draftSavingsGoal === null
        ? null
        : Number(draftSavingsGoal);
    const currentValue =
      draftCurrentSavings === "" || draftCurrentSavings === null
        ? null
        : Number(draftCurrentSavings);

    if (!Number.isNaN(incomeValue) && incomeValue !== (data.income || 0)) {
      lines.push(
        t("financialChart.prompts.updateIncome", { amount: incomeValue }),
      );
    }
    if (goalValue !== data.savingsGoal) {
      lines.push(
        goalValue === null
          ? t("financialChart.prompts.removeSavingsGoal")
          : t("financialChart.prompts.updateSavingsGoal", {
              amount: goalValue,
            }),
      );
    }
    if (currentValue !== data.currentSavings) {
      lines.push(
        t("financialChart.prompts.updateCurrentSavings", {
          amount: currentValue || 0,
        }),
      );
    }

    const cleanedExpenses = draftExpenses
      .filter((expense) => expense.name && Number(expense.amount) > 0)
      .map((expense) => ({
        name: expense.name.trim(),
        amount: Number(expense.amount),
        priority: expense.priority || "important",
      }));

    if (cleanedExpenses.length > 0) {
      lines.push(t("financialChart.prompts.replaceExpensesList"));
      cleanedExpenses.forEach((expense) => {
        lines.push(
          t("financialChart.prompts.expenseLine", {
            name: expense.name,
            amount: expense.amount,
            priority: expense.priority,
          }),
        );
      });
    } else if (draftExpenses.length === 0 && expenses.length > 0) {
      lines.push(t("financialChart.prompts.clearExpensesList"));
    }

    if (updateNotes.trim()) {
      lines.push(
        t("financialChart.prompts.notesPrefix", {
          notes: updateNotes.trim(),
        }),
      );
    }

    return lines;
  }, [
    draftIncome,
    draftSavingsGoal,
    draftCurrentSavings,
    draftExpenses,
    updateNotes,
    data.income,
    data.savingsGoal,
    data.currentSavings,
    expenses.length,
    t,
  ]);

  const buildUpdatePrompt = () => {
    if (updateSummary.length === 0) {
      return "";
    }

    return [...updateSummary, t("financialChart.prompts.updateSuffix")].join(
      "\n",
    );
  };

  const handleApplyUpdates = () => {
    const prompt = buildUpdatePrompt();
    if (!prompt || !onUpdate) return;
    onUpdate(prompt);
  };

  const flashAnimation = keyframes`
    0% { box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
    30% { box-shadow: 0 0 18px rgba(59, 130, 246, 0.45); }
    60% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.25); }
    100% { box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
  `;

  const openInteraction = (item, type, index) => {
    if (!item) return;
    setInteraction({ type, item });
    setInteractionIndex(index);
  };

  const buildInteractionPrompt = (type, item, action) => {
    if (!item) return "";
    if (type === "strategy") {
      return action === "remix"
        ? t("financialChart.prompts.strategyRemix", { title: item.title })
        : t("financialChart.prompts.strategyComplete", { title: item.title });
    }
    if (type === "action") {
      return action === "remix"
        ? t("financialChart.prompts.actionRemix", { action: item.action })
        : t("financialChart.prompts.actionComplete", { action: item.action });
    }
    if (type === "weekly") {
      return action === "remix"
        ? t("financialChart.prompts.weeklyRemix")
        : t("financialChart.prompts.weeklyComplete", { text: item.text });
    }
    if (type === "expense") {
      return action === "remix"
        ? t("financialChart.prompts.expenseRemix", { name: item.name })
        : t("financialChart.prompts.expenseComplete", { name: item.name });
    }
    return "";
  };

  const formatPortfolioAllocations = (allocations) =>
    allocations
      .map((allocation) => `${allocation.percentage}% ${allocation.name}`)
      .join("\n");

  const buildPortfolioUpdatePrompt = (allocations) =>
    t("financialChart.prompts.portfolioUpdate", {
      allocations: formatPortfolioAllocations(allocations),
    });

  const buildPortfolioQualityPrompt = (allocations) =>
    t("financialChart.prompts.portfolioQuality", {
      allocations: formatPortfolioAllocations(allocations),
    });

  const handleAiUpdate = (action) => {
    if (!interaction || !onItemUpdate) return;
    const prompt = buildInteractionPrompt(
      interaction.type,
      interaction.item,
      action,
    );
    if (!prompt) return;
    setInteractionAction(action);
    onItemUpdate(prompt);
  };

  const closeInteraction = () => {
    setInteraction(null);
    setInteractionIndex(null);
  };

  const openPortfolioModal = () => {
    setPortfolioDraft(
      portfolioAllocations.map((allocation) => ({ ...allocation })),
    );
    setPortfolioModalOpen(true);
  };

  const closePortfolioModal = () => {
    setPortfolioModalOpen(false);
  };

  const updatePortfolioDraft = (index, value) => {
    setPortfolioDraft((current) =>
      current.map((allocation, currentIndex) =>
        currentIndex === index
          ? { ...allocation, percentage: Number(value) || 0 }
          : allocation,
      ),
    );
  };

  const savePortfolioDraft = () => {
    setPortfolioAllocations(portfolioDraft);
    setPortfolioCustomized(true);
    setPortfolioModalOpen(false);
    if (!onItemUpdate) return;
    const prompt = buildPortfolioUpdatePrompt(portfolioDraft);
    if (!prompt) return;
    setPortfolioAction("customize");
    onItemUpdate(prompt);
  };

  const handlePortfolioQuality = () => {
    if (!onItemUpdate) return;
    const prompt = buildPortfolioQualityPrompt(portfolioAllocations);
    if (!prompt) return;
    setPortfolioAction("quality");
    onItemUpdate(prompt);
  };

  const portfolioDraftTotal = portfolioDraft.reduce(
    (sum, allocation) => sum + allocation.percentage,
    0,
  );

  return (
    <Box>
      <VStack align="stretch" spacing={{ base: "3", md: "5" }}>
        {/* Plan Header */}
        <PlanHeader
          plan={plan}
          potentialSavings={plan?.potentialSavings}
          t={t}
        />

        {/* Interactive Updates */}
        <Box
          bg={theme.elevatedBg}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={theme.elevatedBorder}
          p={{ base: "4", md: "5" }}
        >
          <VStack align="stretch" spacing="4">
            <HStack justify="space-between" flexWrap="wrap" gap="2">
              <Box>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                  {t("financialChart.updateSection.title")}
                </Text>
                <Text fontSize={{ base: "2xs", md: "xs" }} color={theme.mutedText}>
                  {t("financialChart.updateSection.subtitle")}
                </Text>
              </Box>
            </HStack>

            <Box
              p="3"
              bg={theme.insetBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={theme.insetBorder}
              animation={
                showUpdateFlash ? `${flashAnimation} 1.4s ease-out` : "none"
              }
            >
              <HStack justify="space-between" flexWrap="wrap" gap="2">
                <VStack align="start" spacing="0">
                  <Text fontSize="xs" color={theme.mutedText} fontWeight="semibold">
                    {t("financialChart.updateSection.statusLabel")}
                  </Text>
                  <Text fontSize="xs" color={theme.subText}>
                    {isUpdating
                      ? t("financialChart.updateSection.statusApplying")
                      : updateSummary.length === 0
                        ? t("financialChart.updateSection.statusEmpty")
                        : t("financialChart.updateSection.statusReady")}
                  </Text>
                </VStack>
                <Button
                  size={{ base: "xs", md: "sm" }}
                  colorScheme="blue"
                  onClick={handleApplyUpdates}
                  isDisabled={
                    !onUpdate || updateSummary.length === 0 || isUpdating
                  }
                  aria-label={t("financialChart.updateSection.applyUpdates")}
                >
                  {isUpdating ? (
                    <Spinner size="sm" />
                  ) : (
                    t("financialChart.updateSection.applyUpdates")
                  )}
                </Button>
              </HStack>
            </Box>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap="3"
            >
              <Box>
                <Text fontSize="2xs" color={theme.faintText} mb="1">
                  {t("financialChart.updateSection.monthlyIncome")}
                </Text>
                <Input
                  value={draftIncome}
                  onChange={(e) => setDraftIncome(e.target.value)}
                  type="number"
                  bg={theme.inputBg}
                  borderColor={theme.inputBorder}
                  fontSize="sm"
                />
              </Box>
              <Box>
                <Text fontSize="2xs" color={theme.faintText} mb="1">
                  {t("financialChart.updateSection.currentSavings")}
                </Text>
                <Input
                  value={draftCurrentSavings}
                  onChange={(e) => setDraftCurrentSavings(e.target.value)}
                  type="number"
                  bg={theme.inputBg}
                  borderColor={theme.inputBorder}
                  fontSize="sm"
                />
              </Box>
              <Box>
                <Text fontSize="2xs" color={theme.faintText} mb="1">
                  {t("financialChart.updateSection.savingsGoal")}
                </Text>
                <Input
                  value={draftSavingsGoal}
                  onChange={(e) => setDraftSavingsGoal(e.target.value)}
                  type="number"
                  bg={theme.inputBg}
                  borderColor={theme.inputBorder}
                  fontSize="sm"
                />
              </Box>
            </Grid>

            <VStack align="stretch" spacing="2">
              <HStack justify="space-between">
                <Text fontSize="2xs" color={theme.faintText}>
                  {t("financialChart.updateSection.expenses")}
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={handleAddExpense}
                >
                  {t("financialChart.updateSection.addExpense")}
                </Button>
              </HStack>
              {draftExpenses.map((expense, index) => (
                <Grid
                  key={`${expense.name}-${index}`}
                  templateColumns={{ base: "1fr", md: "2fr 1fr 1fr auto" }}
                  gap="2"
                  alignItems="center"
                >
                  <Input
                    value={expense.name}
                    onChange={(e) =>
                      updateExpenseField(index, "name", e.target.value)
                    }
                    placeholder={t("financialChart.updateSection.expenseName")}
                    bg={theme.inputBg}
                    borderColor={theme.inputBorder}
                    fontSize="sm"
                  />
                  <Input
                    value={expense.amount}
                    onChange={(e) =>
                      updateExpenseField(index, "amount", e.target.value)
                    }
                    type="number"
                    placeholder={t("financialChart.updateSection.amount")}
                    bg={theme.inputBg}
                    borderColor={theme.inputBorder}
                    fontSize="sm"
                  />
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={expense.priority}
                      onChange={(e) =>
                        updateExpenseField(index, "priority", e.target.value)
                      }
                      bg={theme.inputBg}
                      borderColor={theme.inputBorder}
                      fontSize="sm"
                    >
                      <option value="essential">
                        {t("financialChart.priorityLabels.essential")}
                      </option>
                      <option value="important">
                        {t("financialChart.priorityLabels.important")}
                      </option>
                      <option value="discretionary">
                        {t("financialChart.priorityLabels.discretionary")}
                      </option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleRemoveExpense(index)}
                  >
                    {t("financialChart.updateSection.remove")}
                  </Button>
                </Grid>
              ))}
            </VStack>

            <Box>
              <Text fontSize="2xs" color={theme.faintText} mb="1">
                {t("financialChart.updateSection.notesLabel")}
              </Text>
              <Textarea
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                placeholder={t("financialChart.updateSection.notesPlaceholder")}
                bg={theme.inputBg}
                borderColor={theme.inputBorder}
                fontSize="sm"
                minH="90px"
              />
            </Box>
          </VStack>
        </Box>

        {/* Key Metrics */}
        <MetricsSummary
          income={data.income || 0}
          expenses={expenses}
          monthlySavings={monthlySavings}
          savingsGoal={data.savingsGoal}
          currentSavings={data.currentSavings}
          t={t}
        />

        {/* Tabbed Content */}
        <Box
          bg={theme.elevatedBg}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={theme.elevatedBorder}
          overflow="hidden"
        >
          {/* Custom Tab List */}
          <HStack
            p={{ base: "3", md: "4" }}
            bg={theme.insetBg}
            borderBottomWidth="1px"
            borderColor={theme.insetBorder}
            gap={{ base: "1", md: "2" }}
            overflowX="auto"
            css={{
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {[
              t("financialChart.tabs.overview"),
              t("financialChart.tabs.plan"),
              t("financialChart.tabs.portfolio"),
              t("financialChart.tabs.expenses"),
            ].map((tab, index) => (
              <Button
                key={tab}
                size={{ base: "xs", md: "sm" }}
                fontSize={{ base: "xs", md: "sm" }}
                borderRadius="full"
                bg={activeTab === index ? "blue.600" : "transparent"}
                color={activeTab === index ? "white" : theme.mutedText}
                _hover={{ bg: activeTab === index ? "blue.600" : theme.tabHoverBg }}
                onClick={() => setActiveTab(index)}
                flexShrink="0"
                px={{ base: "3", md: "4" }}
              >
                {tab}
              </Button>
            ))}
          </HStack>

          {/* Tab Panels */}
          <Box p={{ base: "3", md: "5" }}>
            {/* Overview Tab */}
            {activeTab === 0 && (
              <VStack align="stretch" spacing={{ base: "3", md: "5" }}>
                <Grid
                  templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                  gap={{ base: "3", md: "5" }}
                >
                  <GridItem>
                    <OverviewChart
                      income={data.income || 0}
                      expenses={expenses}
                      t={t}
                    />
                  </GridItem>
                  <GridItem>
                    <MonthlyChart
                      monthlySavings={monthlySavings}
                      currentSavings={data.currentSavings || 0}
                      savingsGoal={data.savingsGoal}
                      potentialSavings={plan?.potentialSavings}
                      t={t}
                    />
                  </GridItem>
                </Grid>

                {/* Expense Bar Chart */}
                <ExpenseBarChart
                  expenses={expenses}
                  income={data.income || 0}
                  t={t}
                />

                <BirdsEyeView
                  currentSavings={data.currentSavings || 0}
                  savingsGoal={data.savingsGoal}
                  monthlySavings={monthlySavings}
                  expenses={expenses}
                  t={t}
                />
              </VStack>
            )}

            {/* Plan Tab */}
            {activeTab === 1 && (
              <VStack align="stretch" spacing={{ base: "3", md: "5" }}>
                <Grid
                  templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                  gap={{ base: "3", md: "5" }}
                >
                  <GridItem>
                    <SavingsStrategies
                      strategies={interactiveStrategies}
                      onSelect={openInteraction}
                      t={t}
                    />
                  </GridItem>
                  <GridItem>
                    <ActionItems
                      actionItems={interactiveActions}
                      weeklyCheckIn={interactiveWeeklyCheckIn}
                      onSelect={openInteraction}
                      onSelectWeekly={openInteraction}
                      t={t}
                    />
                  </GridItem>
                </Grid>

                <MotivationalNote note={plan?.motivationalNote} t={t} />
              </VStack>
            )}

            {/* Portfolio Tab */}
            {activeTab === 2 && (
              <VStack align="stretch" spacing={{ base: "3", md: "5" }}>
                <InvestmentPortfolio
                  allocations={portfolioAllocations}
                  qualitySummary={plan?.portfolio?.qualitySummary}
                  onCustomize={openPortfolioModal}
                  onQualityCheck={handlePortfolioQuality}
                  isUpdating={isUpdating}
                  portfolioAction={portfolioAction}
                  t={t}
                />
              </VStack>
            )}

            {/* Expenses Tab */}
            {activeTab === 3 && (
              <VStack align="stretch" spacing={{ base: "3", md: "5" }}>
                <ExpenseAnalysis
                  expenses={interactiveExpenses}
                  onSelect={openInteraction}
                  t={t}
                />
              </VStack>
            )}
          </Box>
        </Box>
      </VStack>

      {interaction && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.700"
          zIndex="modal"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={closeInteraction}
        >
          <Box
            bg={theme.elevatedBg}
            p={{ base: "4", md: "6" }}
            borderRadius="xl"
            width={{ base: "92%", sm: "480px" }}
            maxWidth="480px"
            borderWidth="1px"
            borderColor={theme.surfaceBorder}
            onClick={(event) => event.stopPropagation()}
          >
            <VStack align="stretch" spacing="4">
              <HStack justify="space-between" align="start">
                <Box>
                  <Text fontSize="sm" color={theme.mutedText}>
                    {interaction.type === "expense"
                      ? t("financialChart.interaction.expenseQuest")
                      : interaction.type === "weekly"
                        ? t("financialChart.interaction.weeklyCheckIn")
                        : t("financialChart.interaction.planQuest")}
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold">
                    {interaction.item.title ||
                      interaction.item.action ||
                      interaction.item.name ||
                      interaction.item.text}
                  </Text>
                </Box>
                <Button size="xs" variant="ghost" onClick={closeInteraction}>
                  {t("financialChart.interaction.close")}
                </Button>
              </HStack>

              {interaction.item.description && (
                <Text fontSize="sm" color={theme.mutedText}>
                  {interaction.item.description}
                </Text>
              )}

              {interaction.item.recommendation && (
                <Text fontSize="sm" color={theme.subText}>
                  {interaction.item.recommendation}
                </Text>
              )}

              {interaction.item.challenge && (
                <Box
                  bg={theme.surfaceBg}
                  borderRadius="lg"
                  p="3"
                  borderWidth="1px"
                  borderColor={theme.surfaceBorder}
                >
                  <Text fontSize="2xs" color={theme.faintText} mb="1">
                    {t("financialChart.interaction.challenge")}
                  </Text>
                  <Text fontSize="sm" color="cyan.200">
                    {interaction.item.challenge}
                  </Text>
                </Box>
              )}

              <Box
                bg={theme.insetBg}
                borderRadius="lg"
                p="3"
                borderWidth="1px"
                borderColor={theme.insetBorder}
              >
                <Text fontSize="2xs" color={theme.faintText}>
                  {t("financialChart.interaction.nextSteps")}
                </Text>
                <Text fontSize="sm" color="green.300">
                  {t("financialChart.interaction.nextStepsDetail")}
                </Text>
              </Box>

              <HStack spacing="3" flexWrap="wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAiUpdate("remix")}
                  isDisabled={!onItemUpdate || isUpdating}
                >
                  {isUpdating && interactionAction === "remix"
                    ? t("financialChart.interaction.generating")
                    : t("financialChart.interaction.generateDifferent")}
                </Button>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleAiUpdate("complete")}
                  isDisabled={!onItemUpdate || isUpdating}
                >
                  {isUpdating && interactionAction === "complete"
                    ? t("financialChart.interaction.completing")
                    : t("financialChart.interaction.completeExercise")}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}

      {portfolioModalOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.700"
          zIndex="modal"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={closePortfolioModal}
        >
          <Box
            bg={theme.elevatedBg}
            p={{ base: "4", md: "6" }}
            borderRadius="xl"
            width={{ base: "92%", sm: "520px" }}
            maxWidth="520px"
            borderWidth="1px"
            borderColor={theme.surfaceBorder}
            onClick={(event) => event.stopPropagation()}
          >
            <VStack align="stretch" spacing="4">
              <HStack justify="space-between" align="start">
                <Box>
                  <Text fontSize="sm" color={theme.mutedText}>
                    {t("financialChart.portfolio.modalTitle")}
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold">
                    {t("financialChart.portfolio.modalSubtitle")}
                  </Text>
                </Box>
                <Button size="xs" variant="ghost" onClick={closePortfolioModal}>
                  {t("financialChart.portfolio.closeModal")}
                </Button>
              </HStack>

              <VStack align="stretch" spacing="3">
                {portfolioDraft.map((allocation, index) => (
                  <Grid
                    key={`${allocation.name}-${index}`}
                    templateColumns={{ base: "1fr 90px", md: "1fr 120px" }}
                    gap="3"
                    alignItems="center"
                  >
                    <Input
                      value={allocation.name}
                      onChange={(event) =>
                        setPortfolioDraft((current) =>
                          current.map((item, currentIndex) =>
                            currentIndex === index
                              ? { ...item, name: event.target.value }
                              : item,
                          ),
                        )
                      }
                      placeholder={t("financialChart.portfolio.assetPlaceholder")}
                      bg={theme.inputBg}
                      borderColor={theme.inputBorder}
                      fontSize="sm"
                    />
                    <Input
                      type="number"
                      value={allocation.percentage}
                      onChange={(event) =>
                        updatePortfolioDraft(index, event.target.value)
                      }
                      bg={theme.inputBg}
                      borderColor={theme.inputBorder}
                      fontSize="sm"
                      textAlign="right"
                    />
                  </Grid>
                ))}
              </VStack>

              <HStack justify="space-between" align="center">
                <Text fontSize="xs" color={theme.faintText}>
                  {t("financialChart.portfolio.totalLabel")}
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color={theme.subText}>
                  {portfolioDraftTotal}%
                </Text>
              </HStack>

              <HStack justify="flex-end" spacing="2">
                <Button size="sm" variant="ghost" onClick={closePortfolioModal}>
                  {t("financialChart.portfolio.cancelModal")}
                </Button>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={savePortfolioDraft}
                  isDisabled={isUpdating}
                >
                  {t("financialChart.portfolio.saveModal")}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
