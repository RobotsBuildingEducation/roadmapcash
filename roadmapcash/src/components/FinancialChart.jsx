import { useMemo, useState, useEffect } from "react";
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
  Select,
  Textarea,
} from "@chakra-ui/react";

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

const DIFFICULTY_CONFIG = {
  easy: { color: "green", label: "Easy win" },
  medium: { color: "yellow", label: "Some effort" },
  hard: { color: "red", label: "Challenging" },
};

const CATEGORY_CONFIG = {
  cut: { icon: "✂️", color: "red.400", label: "Cut" },
  optimize: { icon: "⚡", color: "yellow.400", label: "Optimize" },
  earn: { icon: "💰", color: "green.400", label: "Earn More" },
  automate: { icon: "🤖", color: "blue.400", label: "Automate" },
  track: { icon: "📊", color: "purple.400", label: "Track" },
};

// Format currency
const formatCurrency = (amount) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount?.toLocaleString() || 0}`;
};

// Plan Header with title and overview
function PlanHeader({ plan, potentialSavings }) {
  if (!plan) return null;

  return (
    <Box
      bg="linear-gradient(135deg, #1e3a5f 0%, #2d1b4e 100%)"
      borderRadius="xl"
      p={{ base: "4", md: "6" }}
      borderWidth="1px"
      borderColor="blue.800"
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
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="white">
              {plan.title || "Your Financial Plan"}
            </Text>
            {potentialSavings > 0 && (
              <Badge
                colorScheme="green"
                fontSize={{ base: "xs", md: "sm" }}
                px="3"
                py="1"
                borderRadius="full"
              >
                +{formatCurrency(potentialSavings)}/mo potential
              </Badge>
            )}
          </HStack>
        </VStack>

        <Text fontSize={{ base: "sm", md: "md" }} color="gray.300" lineHeight="tall">
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
            <Box bg="blue.800" px={{ base: "2", md: "4" }} py="2" borderRadius="lg" textAlign={{ base: "center", md: "left" }}>
              <Text fontSize={{ base: "2xs", md: "xs" }} color="blue.300" fontWeight="medium">
                NEEDS (50%)
              </Text>
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="white">
                {formatCurrency(plan.monthlyBudget.needs)}
              </Text>
            </Box>
            <Box bg="purple.800" px={{ base: "2", md: "4" }} py="2" borderRadius="lg" textAlign={{ base: "center", md: "left" }}>
              <Text fontSize={{ base: "2xs", md: "xs" }} color="purple.300" fontWeight="medium">
                WANTS (30%)
              </Text>
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="white">
                {formatCurrency(plan.monthlyBudget.wants)}
              </Text>
            </Box>
            <Box bg="green.800" px={{ base: "2", md: "4" }} py="2" borderRadius="lg" textAlign={{ base: "center", md: "left" }}>
              <Text fontSize={{ base: "2xs", md: "xs" }} color="green.300" fontWeight="medium">
                SAVINGS (20%)
              </Text>
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="white">
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
function ExpenseAnalysis({ expenses }) {
  if (!expenses || expenses.length === 0) return null;

  const groupedByPriority = {
    essential: expenses.filter((e) => e.priority === "essential"),
    important: expenses.filter((e) => e.priority === "important"),
    discretionary: expenses.filter((e) => e.priority === "discretionary"),
  };

  return (
    <Box
      bg="gray.800"
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor="gray.700"
    >
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="semibold"
        color="gray.400"
        mb={{ base: "3", md: "4" }}
        textTransform="uppercase"
        letterSpacing="wide"
      >
        Expense Analysis & Recommendations
      </Text>

      <VStack align="stretch" spacing={{ base: "3", md: "4" }}>
        {Object.entries(groupedByPriority).map(([priority, items]) => {
          if (items.length === 0) return null;
          const config = PRIORITY_COLORS[priority];
          const total = items.reduce((sum, e) => sum + e.amount, 0);

          return (
            <Box key={priority}>
              <HStack mb="2" flexWrap="wrap" gap="1">
                <Badge
                  colorScheme={config.badge}
                  fontSize={{ base: "2xs", md: "xs" }}
                  textTransform="capitalize"
                >
                  {priority}
                </Badge>
                <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">
                  {items.length} items - {formatCurrency(total)}/mo
                </Text>
              </HStack>

              <VStack align="stretch" spacing="2">
                {items.map((expense, index) => (
                  <Box
                    key={index}
                    p={{ base: "2", md: "3" }}
                    bg={config.bg}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={config.border}
                    borderLeftWidth="3px"
                  >
                    <HStack justify="space-between" mb="1" flexWrap="wrap" gap="1">
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="semibold"
                        color={config.text}
                      >
                        {expense.name}
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="white">
                        {formatCurrency(expense.amount)}
                      </Text>
                    </HStack>
                    <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.400" lineHeight="tall">
                      {expense.recommendation}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

// Savings Strategies
function SavingsStrategies({ strategies }) {
  if (!strategies || strategies.length === 0) return null;

  return (
    <Box
      bg="gray.800"
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor="gray.700"
    >
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="semibold"
        color="gray.400"
        mb={{ base: "3", md: "4" }}
        textTransform="uppercase"
        letterSpacing="wide"
      >
        Your Savings Strategies
      </Text>

      <VStack align="stretch" spacing={{ base: "2", md: "3" }}>
        {strategies.map((strategy, index) => {
          const difficultyConfig =
            DIFFICULTY_CONFIG[strategy.difficulty] || DIFFICULTY_CONFIG.medium;

          return (
            <Box
              key={index}
              p={{ base: "3", md: "4" }}
              bg="gray.750"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.700"
              _hover={{
                borderColor: "gray.600",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s"
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
                  <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="white" isTruncated>
                    {strategy.title}
                  </Text>
                </HStack>
                <Badge colorScheme={difficultyConfig.color} fontSize={{ base: "2xs", md: "xs" }} flexShrink="0">
                  {difficultyConfig.label}
                </Badge>
              </HStack>

              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400" mb="2" pl={{ base: "8", md: "10" }}>
                {strategy.description}
              </Text>

              <HStack pl={{ base: "8", md: "10" }}>
                <Badge colorScheme="green" variant="subtle" fontSize={{ base: "2xs", md: "xs" }}>
                  Impact: {strategy.impact}
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
function ActionItems({ actionItems, weeklyCheckIn }) {
  if (!actionItems || actionItems.length === 0) return null;

  return (
    <Box
      bg="gray.800"
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor="gray.700"
    >
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="semibold"
        color="gray.400"
        mb={{ base: "3", md: "4" }}
        textTransform="uppercase"
        letterSpacing="wide"
      >
        Action Items - Start This Week
      </Text>

      <VStack align="stretch" spacing="2">
        {actionItems.map((item, index) => {
          const categoryConfig =
            CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.track;

          return (
            <HStack
              key={index}
              p={{ base: "2", md: "3" }}
              bg="gray.750"
              borderRadius="lg"
              spacing={{ base: "2", md: "3" }}
              borderWidth="1px"
              borderColor="gray.700"
            >
              <Box
                w={{ base: "6", md: "8" }}
                h={{ base: "6", md: "8" }}
                borderRadius="lg"
                bg="gray.700"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize={{ base: "sm", md: "md" }}
                flexShrink="0"
              >
                {categoryConfig.icon}
              </Box>
              <VStack align="start" spacing="0" flex="1" minW="0">
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.200">
                  {item.action}
                </Text>
                <HStack spacing="2" flexWrap="wrap">
                  <Text fontSize={{ base: "2xs", md: "xs" }} color={categoryConfig.color}>
                    {categoryConfig.label}
                  </Text>
                  <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">
                    •
                  </Text>
                  <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">
                    {item.timeframe}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          );
        })}
      </VStack>

      {weeklyCheckIn && (
        <Box
          mt={{ base: "3", md: "4" }}
          p={{ base: "2", md: "3" }}
          bg="purple.900"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="purple.700"
        >
          <HStack spacing="2" align="start">
            <Text fontSize={{ base: "md", md: "lg" }}>📅</Text>
            <VStack align="start" spacing="0" minW="0">
              <Text fontSize={{ base: "2xs", md: "xs" }} color="purple.300" fontWeight="medium">
                WEEKLY CHECK-IN
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.300">
                {weeklyCheckIn}
              </Text>
            </VStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
}

// Motivational Note
function MotivationalNote({ note }) {
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
          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="green.300">
            Your Coach Says...
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }} color="white" lineHeight="tall">
            {note}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

// Overview Chart - Donut showing income allocation
function OverviewChart({ income, expenses }) {
  const total = income || 1;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsAmount = Math.max(0, income - totalExpenses);

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
        name: "Savings",
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
      bg="gray.800"
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor="gray.700"
    >
      <Text
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="semibold"
        color="gray.400"
        mb={{ base: "3", md: "4" }}
        textTransform="uppercase"
        letterSpacing="wide"
      >
        Income Allocation
      </Text>

      <VStack spacing={{ base: "4", md: "6" }} align="stretch">
        <HStack spacing={{ base: "4", md: "6" }} align="center" justify="center" flexWrap={{ base: "wrap", md: "nowrap" }}>
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
              <circle cx="80" cy="80" r="45" fill="#1f2937" />
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
                fill="#9ca3af"
                fontSize="11"
              >
                saved
              </text>
            </svg>
          </Box>

          <VStack align="start" spacing="2" flex="1" minW="0">
            {segments.slice(0, 5).map((segment, index) => (
              <HStack key={index} justify="space-between" w="100%">
                <HStack spacing="2" minW="0" flex="1">
                  <Box w="3" h="3" borderRadius="full" bg={segment.color} flexShrink="0" />
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.300" isTruncated>
                    {segment.name}
                  </Text>
                </HStack>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color={segment.isSavings ? "green.400" : "gray.400"}
                  fontWeight="medium"
                  flexShrink="0"
                >
                  {formatCurrency(segment.amount)}
                </Text>
              </HStack>
            ))}
            {segments.length > 5 && (
              <Text fontSize="xs" color="gray.500">
                +{segments.length - 5} more
              </Text>
            )}
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}

// Monthly Projection Chart
function MonthlyChart({
  monthlySavings,
  currentSavings,
  savingsGoal,
  potentialSavings,
}) {
  const projectionMonths = 24;

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
          month === 0 ? "Now" : month === 12 ? "1Y" : month === 24 ? "2Y" : "",
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
      bg="gray.800"
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor="gray.700"
    >
      <HStack justify="space-between" mb={{ base: "2", md: "3" }} flexWrap="wrap" gap="2">
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="semibold"
          color="gray.400"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          Growth Projection
        </Text>
        <Badge colorScheme={monthlySavings > 0 ? "green" : "red"} fontSize="xs">
          {monthlySavings >= 0 ? "+" : ""}
          {formatCurrency(monthlySavings)}/mo
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
            stroke="#374151"
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
            >
              GOAL
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
              fill="#9ca3af"
              fontSize="10"
            >
              {d.label}
            </text>
          ))}
      </svg>

      <HStack justify="space-between" mt="2" flexWrap="wrap" gap="2">
        <VStack align="start" spacing="0">
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">
            Current path
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="cyan.400">
            {formatCurrency(endBalance)} in 2Y
          </Text>
        </VStack>
        {potentialSavings > 0 && (
          <VStack align="end" spacing="0">
            <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">
              With plan
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="green.400">
              {formatCurrency(optimizedEndBalance)} in 2Y
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
}) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

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
        label: "Emergency Fund",
        sublabel: "3 months expenses",
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
        label: "25% Progress",
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
        label: "Halfway",
        amount: half,
        months: monthsTo50,
        icon: "star",
      });
    }

    milestonePoints.push({
      label: "Goal Reached",
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
      bg="gray.800"
      borderRadius="xl"
      p={{ base: "4", md: "5" }}
      borderWidth="1px"
      borderColor="gray.700"
    >
      <HStack justify="space-between" mb={{ base: "3", md: "4" }} flexWrap="wrap" gap="2">
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="semibold"
          color="gray.400"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          Your Roadmap
        </Text>
        {monthsToGoal && monthsToGoal > 0 && (
          <Badge colorScheme="purple" fontSize="xs">
            {monthsToGoal < 12
              ? `${monthsToGoal} months to go`
              : `${(monthsToGoal / 12).toFixed(1)} years to go`}
          </Badge>
        )}
      </HStack>

      <Box mb="5">
        <HStack justify="space-between" mb="2">
          <Text fontSize="xs" color="gray.500">
            Current Progress
          </Text>
          <Text fontSize="xs" color="green.400" fontWeight="bold">
            {progressPercent.toFixed(1)}%
          </Text>
        </HStack>
        <Box
          position="relative"
          h="3"
          bg="gray.700"
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
                bg={position <= progressPercent ? "green.400" : "gray.500"}
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
                bg={isReached ? "green.900" : "gray.750"}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={
                  isReached
                    ? "green.700"
                    : milestone.isFinal
                      ? "purple.700"
                      : "gray.700"
                }
                opacity={isReached ? 0.7 : 1}
              >
                <Box
                  w={{ base: "8", md: "10" }}
                  h={{ base: "8", md: "10" }}
                  borderRadius="lg"
                  bg={
                    isReached
                      ? "green.600"
                      : milestone.isFinal
                        ? "purple.600"
                        : "gray.600"
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
                    color={isReached ? "green.300" : "gray.200"}
                    isTruncated
                  >
                    {milestone.label}
                  </Text>
                  <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" isTruncated>
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
                          : "gray.400"
                    }
                  >
                    {isReached ? "Done" : `${milestone.months} mo`}
                  </Text>
                  {!isReached && (
                    <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">
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
        <Box p="4" bg="gray.750" borderRadius="lg" textAlign="center">
          <Text fontSize="sm" color="gray.400">
            {!savingsGoal
              ? "Set a savings goal to see your roadmap"
              : "Increase your savings rate to start building your roadmap"}
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
}) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsRate =
    income > 0 ? ((monthlySavings / income) * 100).toFixed(0) : 0;

  return (
    <Grid
      templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
      gap={{ base: "2", md: "3" }}
    >
      <GridItem>
        <Box
          bg="gray.800"
          borderRadius="xl"
          p={{ base: "3", md: "4" }}
          borderWidth="1px"
          borderColor="gray.700"
          textAlign="center"
        >
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" mb="1">
            Monthly Income
          </Text>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="green.400">
            {formatCurrency(income)}
          </Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box
          bg="gray.800"
          borderRadius="xl"
          p={{ base: "3", md: "4" }}
          borderWidth="1px"
          borderColor="gray.700"
          textAlign="center"
        >
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" mb="1">
            Expenses
          </Text>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="red.400">
            {formatCurrency(totalExpenses)}
          </Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box
          bg="gray.800"
          borderRadius="xl"
          p={{ base: "3", md: "4" }}
          borderWidth="1px"
          borderColor="gray.700"
          textAlign="center"
        >
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" mb="1">
            You Save
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
            {savingsRate}% rate
          </Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box
          bg="gray.800"
          borderRadius="xl"
          p={{ base: "3", md: "4" }}
          borderWidth="1px"
          borderColor="gray.700"
          textAlign="center"
        >
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" mb="1">
            Goal Progress
          </Text>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="purple.400">
            {savingsGoal ? formatCurrency(currentSavings || 0) : "--"}
          </Text>
          {savingsGoal && (
            <Text fontSize={{ base: "2xs", md: "xs" }} color="purple.600">
              of {formatCurrency(savingsGoal)}
            </Text>
          )}
        </Box>
      </GridItem>
    </Grid>
  );
}

// Main FinancialChart component
export function FinancialChart({ data, onUpdate }) {
  const [activeTab, setActiveTab] = useState(0);
  const [draftIncome, setDraftIncome] = useState(0);
  const [draftSavingsGoal, setDraftSavingsGoal] = useState("");
  const [draftCurrentSavings, setDraftCurrentSavings] = useState("");
  const [draftExpenses, setDraftExpenses] = useState([]);
  const [updateNotes, setUpdateNotes] = useState("");

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

  const buildUpdatePrompt = () => {
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
      lines.push(`Update monthly income to $${incomeValue}.`);
    }
    if (goalValue !== data.savingsGoal) {
      lines.push(
        goalValue === null
          ? "Remove the savings goal for now."
          : `Update savings goal to $${goalValue}.`,
      );
    }
    if (currentValue !== data.currentSavings) {
      lines.push(`Update current savings to $${currentValue || 0}.`);
    }

    const cleanedExpenses = draftExpenses
      .filter((expense) => expense.name && Number(expense.amount) > 0)
      .map((expense) => ({
        name: expense.name.trim(),
        amount: Number(expense.amount),
        priority: expense.priority || "important",
      }));

    if (cleanedExpenses.length > 0) {
      lines.push("Replace my expense list with:");
      cleanedExpenses.forEach((expense) => {
        lines.push(
          `- ${expense.name}: $${expense.amount} (${expense.priority})`,
        );
      });
    } else if (draftExpenses.length === 0 && expenses.length > 0) {
      lines.push("Clear my expense list for now.");
    }

    if (updateNotes.trim()) {
      lines.push(`Notes: ${updateNotes.trim()}`);
    }

    if (lines.length === 0) {
      return "";
    }

    lines.push(
      "Recalculate recommendations, monthly budget, potential savings, and update the plan accordingly.",
    );

    return lines.join("\n");
  };

  const handleApplyUpdates = () => {
    const prompt = buildUpdatePrompt();
    if (!prompt || !onUpdate) return;
    onUpdate(prompt);
  };

  return (
    <Box>
      <VStack align="stretch" spacing={{ base: "3", md: "5" }}>
        {/* Plan Header */}
        <PlanHeader plan={plan} potentialSavings={plan?.potentialSavings} />

        {/* Interactive Updates */}
        <Box
          bg="gray.900"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.800"
          p={{ base: "4", md: "5" }}
        >
          <VStack align="stretch" spacing="4">
            <HStack justify="space-between" flexWrap="wrap" gap="2">
              <Box>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                  Update Your Data
                </Text>
                <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.400">
                  Adjust numbers directly and let AI refresh your plan.
                </Text>
              </Box>
              <Button
                size={{ base: "xs", md: "sm" }}
                colorScheme="blue"
                onClick={handleApplyUpdates}
                isDisabled={!onUpdate}
              >
                Apply updates
              </Button>
            </HStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="3">
              <Box>
                <Text fontSize="2xs" color="gray.500" mb="1">
                  Monthly income
                </Text>
                <Input
                  value={draftIncome}
                  onChange={(e) => setDraftIncome(e.target.value)}
                  type="number"
                  bg="gray.800"
                  borderColor="gray.700"
                  fontSize="sm"
                />
              </Box>
              <Box>
                <Text fontSize="2xs" color="gray.500" mb="1">
                  Current savings
                </Text>
                <Input
                  value={draftCurrentSavings}
                  onChange={(e) => setDraftCurrentSavings(e.target.value)}
                  type="number"
                  bg="gray.800"
                  borderColor="gray.700"
                  fontSize="sm"
                />
              </Box>
              <Box>
                <Text fontSize="2xs" color="gray.500" mb="1">
                  Savings goal
                </Text>
                <Input
                  value={draftSavingsGoal}
                  onChange={(e) => setDraftSavingsGoal(e.target.value)}
                  type="number"
                  bg="gray.800"
                  borderColor="gray.700"
                  fontSize="sm"
                />
              </Box>
            </Grid>

            <VStack align="stretch" spacing="2">
              <HStack justify="space-between">
                <Text fontSize="2xs" color="gray.500">
                  Expenses
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={handleAddExpense}
                >
                  Add expense
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
                    placeholder="Expense name"
                    bg="gray.800"
                    borderColor="gray.700"
                    fontSize="sm"
                  />
                  <Input
                    value={expense.amount}
                    onChange={(e) =>
                      updateExpenseField(index, "amount", e.target.value)
                    }
                    type="number"
                    placeholder="Amount"
                    bg="gray.800"
                    borderColor="gray.700"
                    fontSize="sm"
                  />
                  <Select
                    value={expense.priority}
                    onChange={(e) =>
                      updateExpenseField(index, "priority", e.target.value)
                    }
                    bg="gray.800"
                    borderColor="gray.700"
                    fontSize="sm"
                  >
                    <option value="essential">Essential</option>
                    <option value="important">Important</option>
                    <option value="discretionary">Discretionary</option>
                  </Select>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleRemoveExpense(index)}
                  >
                    Remove
                  </Button>
                </Grid>
              ))}
            </VStack>

            <Box>
              <Text fontSize="2xs" color="gray.500" mb="1">
                Notes for AI (optional)
              </Text>
              <Textarea
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                placeholder="Add context: new job, moving, debt payoff, etc."
                bg="gray.800"
                borderColor="gray.700"
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
        />

        {/* Tabbed Content */}
        <Box
          bg="gray.900"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.800"
          overflow="hidden"
        >
          {/* Custom Tab List */}
          <HStack
            p={{ base: "3", md: "4" }}
            bg="gray.850"
            borderBottomWidth="1px"
            borderColor="gray.800"
            gap={{ base: "1", md: "2" }}
            overflowX="auto"
            css={{
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {["Overview", "Your Plan", "Expenses"].map((tab, index) => (
              <Button
                key={tab}
                size={{ base: "xs", md: "sm" }}
                fontSize={{ base: "xs", md: "sm" }}
                borderRadius="full"
                bg={activeTab === index ? "blue.600" : "transparent"}
                color={activeTab === index ? "white" : "gray.400"}
                _hover={{ bg: activeTab === index ? "blue.600" : "gray.700" }}
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
                <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: "3", md: "5" }}>
                  <GridItem>
                    <OverviewChart
                      income={data.income || 0}
                      expenses={expenses}
                    />
                  </GridItem>
                  <GridItem>
                    <MonthlyChart
                      monthlySavings={monthlySavings}
                      currentSavings={data.currentSavings || 0}
                      savingsGoal={data.savingsGoal}
                      potentialSavings={plan?.potentialSavings}
                    />
                  </GridItem>
                </Grid>

                <BirdsEyeView
                  currentSavings={data.currentSavings || 0}
                  savingsGoal={data.savingsGoal}
                  monthlySavings={monthlySavings}
                  expenses={expenses}
                />
              </VStack>
            )}

            {/* Plan Tab */}
            {activeTab === 1 && (
              <VStack align="stretch" spacing={{ base: "3", md: "5" }}>
                <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: "3", md: "5" }}>
                  <GridItem>
                    <SavingsStrategies strategies={plan?.strategies} />
                  </GridItem>
                  <GridItem>
                    <ActionItems
                      actionItems={plan?.actionItems}
                      weeklyCheckIn={plan?.weeklyCheckIn}
                    />
                  </GridItem>
                </Grid>

                <MotivationalNote note={plan?.motivationalNote} />
              </VStack>
            )}

            {/* Expenses Tab */}
            {activeTab === 2 && <ExpenseAnalysis expenses={expenses} />}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
