import { useMemo } from "react";
import { Box, VStack, Text, HStack, Badge, Grid, GridItem } from "@chakra-ui/react";

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
  expenses: ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"],
};

// Format currency
const formatCurrency = (amount) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
};

// Overview Chart - Donut showing income allocation
function OverviewChart({ income, expenses, savings }) {
  const total = income || 1;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsAmount = Math.max(0, income - totalExpenses);

  const segments = useMemo(() => {
    const result = [];
    let currentAngle = -90;

    // Add expense segments
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

    // Add savings segment if positive
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
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ].join(" ");
  };

  const polarToCartesian = (cx, cy, radius, angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const savingsPercentage = income > 0 ? ((savingsAmount / income) * 100).toFixed(0) : 0;

  return (
    <Box bg="gray.800" borderRadius="xl" p="5" borderWidth="1px" borderColor="gray.700">
      <Text fontSize="sm" fontWeight="semibold" color="gray.400" mb="4" textTransform="uppercase" letterSpacing="wide">
        Income Allocation
      </Text>

      <HStack spacing="6" align="center">
        <Box position="relative">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={describeArc(80, 80, 60, segment.startAngle, segment.endAngle - 0.5)}
                fill="none"
                stroke={segment.color}
                strokeWidth="20"
                strokeLinecap="round"
                style={{
                  filter: segment.isSavings ? "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))" : "none",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
            {/* Center circle */}
            <circle cx="80" cy="80" r="45" fill="#1f2937" />
            <text x="80" y="72" textAnchor="middle" fill="#10b981" fontSize="24" fontWeight="bold">
              {savingsPercentage}%
            </text>
            <text x="80" y="92" textAnchor="middle" fill="#9ca3af" fontSize="11">
              saved
            </text>
          </svg>
        </Box>

        <VStack align="start" spacing="2" flex="1">
          {segments.slice(0, 5).map((segment, index) => (
            <HStack key={index} justify="space-between" w="100%">
              <HStack spacing="2">
                <Box w="3" h="3" borderRadius="full" bg={segment.color} />
                <Text fontSize="sm" color="gray.300" isTruncated maxW="100px">
                  {segment.name}
                </Text>
              </HStack>
              <Text fontSize="sm" color={segment.isSavings ? "green.400" : "gray.400"} fontWeight="medium">
                {formatCurrency(segment.amount)}
              </Text>
            </HStack>
          ))}
          {segments.length > 5 && (
            <Text fontSize="xs" color="gray.500">+{segments.length - 5} more</Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}

// Monthly Projection Chart - Area chart showing savings growth
function MonthlyChart({ monthlySavings, currentSavings, savingsGoal }) {
  const projectionMonths = 24;

  const projectionData = useMemo(() => {
    const data = [];
    let balance = currentSavings || 0;

    for (let month = 0; month <= projectionMonths; month++) {
      data.push({
        month,
        balance,
        label: month === 0 ? "Now" : month === 12 ? "1Y" : month === 24 ? "2Y" : "",
      });
      balance += Math.max(0, monthlySavings);
    }

    return data;
  }, [monthlySavings, currentSavings]);

  const maxBalance = Math.max(...projectionData.map(d => d.balance), savingsGoal || 0, 1);
  const chartWidth = 320;
  const chartHeight = 140;
  const padding = { top: 10, right: 10, bottom: 25, left: 10 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Generate path for area
  const areaPath = useMemo(() => {
    const points = projectionData.map((d, i) => {
      const x = padding.left + (i / projectionMonths) * innerWidth;
      const y = padding.top + innerHeight - (d.balance / maxBalance) * innerHeight;
      return `${x},${y}`;
    });

    const bottomRight = `${padding.left + innerWidth},${padding.top + innerHeight}`;
    const bottomLeft = `${padding.left},${padding.top + innerHeight}`;

    return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(" ")} L${bottomRight} L${bottomLeft} Z`;
  }, [projectionData, maxBalance, innerWidth, innerHeight]);

  // Generate path for line
  const linePath = useMemo(() => {
    const points = projectionData.map((d, i) => {
      const x = padding.left + (i / projectionMonths) * innerWidth;
      const y = padding.top + innerHeight - (d.balance / maxBalance) * innerHeight;
      return `${x},${y}`;
    });

    return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(" ")}`;
  }, [projectionData, maxBalance, innerWidth, innerHeight]);

  // Calculate goal line position
  const goalY = savingsGoal
    ? padding.top + innerHeight - (savingsGoal / maxBalance) * innerHeight
    : null;

  // Find month when goal is reached
  const goalReachedMonth = projectionData.findIndex(d => d.balance >= (savingsGoal || Infinity));
  const goalReachedX = goalReachedMonth >= 0
    ? padding.left + (goalReachedMonth / projectionMonths) * innerWidth
    : null;

  const endBalance = projectionData[projectionData.length - 1].balance;

  return (
    <Box bg="gray.800" borderRadius="xl" p="5" borderWidth="1px" borderColor="gray.700">
      <HStack justify="space-between" mb="3">
        <Text fontSize="sm" fontWeight="semibold" color="gray.400" textTransform="uppercase" letterSpacing="wide">
          Growth Projection
        </Text>
        <Badge colorScheme={monthlySavings > 0 ? "green" : "red"} fontSize="xs">
          {monthlySavings >= 0 ? "+" : ""}{formatCurrency(monthlySavings)}/mo
        </Badge>
      </HStack>

      <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
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
            <text x={padding.left + 5} y={goalY - 5} fill="#f59e0b" fontSize="10" fontWeight="bold">
              GOAL
            </text>
          </>
        )}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" />

        {/* Goal reached indicator */}
        {goalReachedX && goalY && (
          <g>
            <circle cx={goalReachedX} cy={goalY} r="6" fill="#10b981" />
            <circle cx={goalReachedX} cy={goalY} r="10" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5" />
          </g>
        )}

        {/* End point */}
        <circle
          cx={padding.left + innerWidth}
          cy={padding.top + innerHeight - (endBalance / maxBalance) * innerHeight}
          r="5"
          fill="#10b981"
        />

        {/* X-axis labels */}
        {projectionData.filter(d => d.label).map((d, i) => (
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

      <HStack justify="space-between" mt="2">
        <VStack align="start" spacing="0">
          <Text fontSize="xs" color="gray.500">Now</Text>
          <Text fontSize="sm" fontWeight="bold" color="cyan.400">{formatCurrency(currentSavings || 0)}</Text>
        </VStack>
        <VStack align="end" spacing="0">
          <Text fontSize="xs" color="gray.500">In 2 years</Text>
          <Text fontSize="sm" fontWeight="bold" color="green.400">{formatCurrency(endBalance)}</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

// Bird's Eye View - Timeline showing the journey
function BirdsEyeView({ currentSavings, savingsGoal, monthlySavings, income, expenses }) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const milestones = useMemo(() => {
    if (!savingsGoal || monthlySavings <= 0) return [];

    const monthsToGoal = Math.ceil((savingsGoal - (currentSavings || 0)) / monthlySavings);
    const milestonePoints = [];

    // Emergency fund milestone (3 months expenses)
    const emergencyFund = totalExpenses * 3;
    if (emergencyFund > (currentSavings || 0) && emergencyFund < savingsGoal) {
      const monthsToEmergency = Math.ceil((emergencyFund - (currentSavings || 0)) / monthlySavings);
      milestonePoints.push({
        label: "Emergency Fund",
        sublabel: "3 months expenses",
        amount: emergencyFund,
        months: monthsToEmergency,
        icon: "shield",
      });
    }

    // 25% milestone
    const quarter = savingsGoal * 0.25;
    if (quarter > (currentSavings || 0)) {
      const monthsTo25 = Math.ceil((quarter - (currentSavings || 0)) / monthlySavings);
      milestonePoints.push({
        label: "25% Progress",
        amount: quarter,
        months: monthsTo25,
        icon: "flag",
      });
    }

    // 50% milestone
    const half = savingsGoal * 0.5;
    if (half > (currentSavings || 0)) {
      const monthsTo50 = Math.ceil((half - (currentSavings || 0)) / monthlySavings);
      milestonePoints.push({
        label: "Halfway",
        amount: half,
        months: monthsTo50,
        icon: "star",
      });
    }

    // Final goal
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

  const monthsToGoal = monthlySavings > 0 && savingsGoal
    ? Math.ceil((savingsGoal - (currentSavings || 0)) / monthlySavings)
    : null;

  return (
    <Box bg="gray.800" borderRadius="xl" p="5" borderWidth="1px" borderColor="gray.700">
      <HStack justify="space-between" mb="4">
        <Text fontSize="sm" fontWeight="semibold" color="gray.400" textTransform="uppercase" letterSpacing="wide">
          Your Roadmap
        </Text>
        {monthsToGoal && monthsToGoal > 0 && (
          <Badge colorScheme="purple" fontSize="xs">
            {monthsToGoal < 12
              ? `${monthsToGoal} months to go`
              : `${(monthsToGoal / 12).toFixed(1)} years to go`
            }
          </Badge>
        )}
      </HStack>

      {/* Progress bar */}
      <Box mb="5">
        <HStack justify="space-between" mb="2">
          <Text fontSize="xs" color="gray.500">Current Progress</Text>
          <Text fontSize="xs" color="green.400" fontWeight="bold">{progressPercent.toFixed(1)}%</Text>
        </HStack>
        <Box position="relative" h="3" bg="gray.700" borderRadius="full" overflow="hidden">
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
          {/* Milestone markers */}
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

      {/* Milestones timeline */}
      {milestones.length > 0 && (
        <VStack align="stretch" spacing="3">
          {milestones.map((milestone, index) => {
            const isReached = (currentSavings || 0) >= milestone.amount;
            return (
              <HStack
                key={index}
                p="3"
                bg={isReached ? "green.900" : "gray.750"}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={isReached ? "green.700" : milestone.isFinal ? "purple.700" : "gray.700"}
                opacity={isReached ? 0.7 : 1}
              >
                <Box
                  w="10"
                  h="10"
                  borderRadius="lg"
                  bg={isReached ? "green.600" : milestone.isFinal ? "purple.600" : "gray.600"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink="0"
                >
                  <Text fontSize="lg">
                    {milestone.icon === "shield" && "🛡️"}
                    {milestone.icon === "flag" && "🚩"}
                    {milestone.icon === "star" && "⭐"}
                    {milestone.icon === "trophy" && "🏆"}
                  </Text>
                </Box>
                <VStack align="start" spacing="0" flex="1">
                  <Text fontSize="sm" fontWeight="semibold" color={isReached ? "green.300" : "gray.200"}>
                    {milestone.label}
                    {isReached && " ✓"}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {milestone.sublabel || formatCurrency(milestone.amount)}
                  </Text>
                </VStack>
                <VStack align="end" spacing="0">
                  <Text fontSize="sm" fontWeight="bold" color={isReached ? "green.400" : milestone.isFinal ? "purple.400" : "gray.400"}>
                    {isReached ? "Done" : `${milestone.months} mo`}
                  </Text>
                  {!isReached && (
                    <Text fontSize="xs" color="gray.500">
                      {formatCurrency(milestone.amount)}
                    </Text>
                  )}
                </VStack>
              </HStack>
            );
          })}
        </VStack>
      )}

      {/* No goal set message */}
      {(!savingsGoal || monthlySavings <= 0) && (
        <Box p="4" bg="gray.750" borderRadius="lg" textAlign="center">
          <Text fontSize="sm" color="gray.400">
            {!savingsGoal
              ? "Set a savings goal to see your roadmap"
              : "Increase your savings rate to start building your roadmap"
            }
          </Text>
        </Box>
      )}
    </Box>
  );
}

// Key Metrics Summary
function MetricsSummary({ income, expenses, monthlySavings, savingsGoal, currentSavings }) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsRate = income > 0 ? ((monthlySavings / income) * 100).toFixed(0) : 0;
  const monthsToGoal = monthlySavings > 0 && savingsGoal
    ? Math.ceil((savingsGoal - (currentSavings || 0)) / monthlySavings)
    : null;

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap="3">
      <GridItem>
        <Box bg="gray.800" borderRadius="xl" p="4" borderWidth="1px" borderColor="gray.700" textAlign="center">
          <Text fontSize="xs" color="gray.500" mb="1">Monthly Income</Text>
          <Text fontSize="xl" fontWeight="bold" color="green.400">{formatCurrency(income)}</Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box bg="gray.800" borderRadius="xl" p="4" borderWidth="1px" borderColor="gray.700" textAlign="center">
          <Text fontSize="xs" color="gray.500" mb="1">Expenses</Text>
          <Text fontSize="xl" fontWeight="bold" color="red.400">{formatCurrency(totalExpenses)}</Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box bg="gray.800" borderRadius="xl" p="4" borderWidth="1px" borderColor="gray.700" textAlign="center">
          <Text fontSize="xs" color="gray.500" mb="1">You Save</Text>
          <Text fontSize="xl" fontWeight="bold" color={monthlySavings >= 0 ? "cyan.400" : "red.400"}>
            {formatCurrency(Math.abs(monthlySavings))}
          </Text>
          <Text fontSize="xs" color={monthlySavings >= 0 ? "cyan.600" : "red.600"}>
            {savingsRate}% rate
          </Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box bg="gray.800" borderRadius="xl" p="4" borderWidth="1px" borderColor="gray.700" textAlign="center">
          <Text fontSize="xs" color="gray.500" mb="1">Goal Progress</Text>
          <Text fontSize="xl" fontWeight="bold" color="purple.400">
            {savingsGoal ? formatCurrency(currentSavings || 0) : "--"}
          </Text>
          {savingsGoal && (
            <Text fontSize="xs" color="purple.600">
              of {formatCurrency(savingsGoal)}
            </Text>
          )}
        </Box>
      </GridItem>
    </Grid>
  );
}

// Main FinancialChart component
export function FinancialChart({ data }) {
  if (!data) return null;

  const expenses = data.expenses || [];
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlySavings = (data.income || 0) - totalExpenses;

  return (
    <Box p="6" bg="gray.900" borderRadius="xl" borderWidth="1px" borderColor="gray.800">
      <VStack align="stretch" spacing="5">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, cyan.400, green.400)" bgClip="text">
            Your Financial Outlook
          </Text>
          {data.savingsGoal && monthlySavings > 0 && (
            <Badge
              colorScheme="green"
              fontSize="sm"
              px="3"
              py="1"
              borderRadius="full"
              variant="subtle"
            >
              On Track
            </Badge>
          )}
          {monthlySavings < 0 && (
            <Badge
              colorScheme="red"
              fontSize="sm"
              px="3"
              py="1"
              borderRadius="full"
              variant="subtle"
            >
              Over Budget
            </Badge>
          )}
        </HStack>

        {/* Key Metrics */}
        <MetricsSummary
          income={data.income || 0}
          expenses={expenses}
          monthlySavings={monthlySavings}
          savingsGoal={data.savingsGoal}
          currentSavings={data.currentSavings}
        />

        {/* Charts Grid */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="5">
          {/* Overview Chart */}
          <GridItem>
            <OverviewChart
              income={data.income || 0}
              expenses={expenses}
              savings={monthlySavings}
            />
          </GridItem>

          {/* Monthly Projection */}
          <GridItem>
            <MonthlyChart
              monthlySavings={monthlySavings}
              currentSavings={data.currentSavings || 0}
              savingsGoal={data.savingsGoal}
            />
          </GridItem>
        </Grid>

        {/* Bird's Eye View - Full Width */}
        <BirdsEyeView
          currentSavings={data.currentSavings || 0}
          savingsGoal={data.savingsGoal}
          monthlySavings={monthlySavings}
          income={data.income || 0}
          expenses={expenses}
        />
      </VStack>
    </Box>
  );
}
