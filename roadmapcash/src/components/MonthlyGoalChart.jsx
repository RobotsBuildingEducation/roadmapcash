import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Progress,
} from "@chakra-ui/react";

// Cute fat dog SVG component
function FatDog({ color, name, size = 60, isWinning = false, emotion = "happy" }) {
  const bounceAnimation = isWinning
    ? "bounce 0.5s ease-in-out infinite"
    : "waddle 2s ease-in-out infinite";

  const eyeExpression = emotion === "happy" ? "^" : emotion === "determined" ? ">" : "o";

  return (
    <Box
      position="relative"
      textAlign="center"
      style={{
        animation: bounceAnimation,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ overflow: "visible" }}
      >
        {/* Fat round body */}
        <ellipse
          cx="50"
          cy="60"
          rx="35"
          ry="30"
          fill={color}
          stroke="#333"
          strokeWidth="2"
        />

        {/* Chubby cheeks / face */}
        <circle cx="50" cy="35" r="25" fill={color} stroke="#333" strokeWidth="2" />

        {/* Floppy ears */}
        <ellipse
          cx="28"
          cy="25"
          rx="10"
          ry="15"
          fill={color}
          stroke="#333"
          strokeWidth="2"
          transform="rotate(-20 28 25)"
        />
        <ellipse
          cx="72"
          cy="25"
          rx="10"
          ry="15"
          fill={color}
          stroke="#333"
          strokeWidth="2"
          transform="rotate(20 72 25)"
        />

        {/* Eyes */}
        <text x="40" y="38" fontSize="12" fill="#333" fontWeight="bold">
          {eyeExpression}
        </text>
        <text x="55" y="38" fontSize="12" fill="#333" fontWeight="bold">
          {eyeExpression}
        </text>

        {/* Nose */}
        <ellipse cx="50" cy="42" rx="5" ry="4" fill="#333" />

        {/* Happy mouth */}
        <path
          d="M 42 48 Q 50 55 58 48"
          fill="none"
          stroke="#333"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Stubby legs */}
        <ellipse cx="30" cy="85" rx="8" ry="10" fill={color} stroke="#333" strokeWidth="2" />
        <ellipse cx="70" cy="85" rx="8" ry="10" fill={color} stroke="#333" strokeWidth="2" />

        {/* Tiny tail */}
        <ellipse
          cx="85"
          cy="55"
          rx="8"
          ry="5"
          fill={color}
          stroke="#333"
          strokeWidth="2"
        />
      </svg>
      <Text fontSize="xs" fontWeight="bold" color="gray.300" mt="1">
        {name}
      </Text>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes waddle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </Box>
  );
}

// Resource bone that dogs compete for
function ResourceBone({ amount, label }) {
  return (
    <VStack gap="1">
      <svg width="50" height="25" viewBox="0 0 50 25">
        {/* Bone shape */}
        <ellipse cx="8" cy="8" rx="7" ry="6" fill="#F5DEB3" stroke="#D2B48C" strokeWidth="1" />
        <ellipse cx="8" cy="17" rx="7" ry="6" fill="#F5DEB3" stroke="#D2B48C" strokeWidth="1" />
        <ellipse cx="42" cy="8" rx="7" ry="6" fill="#F5DEB3" stroke="#D2B48C" strokeWidth="1" />
        <ellipse cx="42" cy="17" rx="7" ry="6" fill="#F5DEB3" stroke="#D2B48C" strokeWidth="1" />
        <rect x="8" y="6" width="34" height="13" fill="#F5DEB3" />
        <line x1="8" y1="6" x2="42" y2="6" stroke="#D2B48C" strokeWidth="1" />
        <line x1="8" y1="19" x2="42" y2="19" stroke="#D2B48C" strokeWidth="1" />
      </svg>
      <Text fontSize="sm" fontWeight="bold" color="yellow.300">
        ${amount}
      </Text>
      <Text fontSize="xs" color="gray.400">
        {label}
      </Text>
    </VStack>
  );
}

export function MonthlyGoalChart() {
  const [goal, setGoal] = useState("");
  const [goalAmount, setGoalAmount] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [isSetup, setIsSetup] = useState(false);

  // Resource categories that dogs compete for
  const [resources, setResources] = useState([
    { id: "savings", name: "Savings", dog: "Chunk", color: "#7CB342", allocated: 30 },
    { id: "needs", name: "Needs", dog: "Biscuit", color: "#42A5F5", allocated: 50 },
    { id: "wants", name: "Wants", dog: "Mochi", color: "#AB47BC", allocated: 15 },
    { id: "invest", name: "Invest", dog: "Nugget", color: "#FFA726", allocated: 5 },
  ]);

  const handleSetGoal = () => {
    const amount = parseFloat(goalAmount);
    const monthly = parseFloat(monthlyBudget);
    if (amount > 0 && monthly > 0) {
      setIsSetup(true);
    }
  };

  const adjustAllocation = (id, change) => {
    setResources((prev) => {
      const updated = prev.map((r) => {
        if (r.id === id) {
          const newVal = Math.max(0, Math.min(100, r.allocated + change));
          return { ...r, allocated: newVal };
        }
        return r;
      });

      // Normalize to 100%
      const total = updated.reduce((sum, r) => sum + r.allocated, 0);
      if (total > 0) {
        return updated.map((r) => ({
          ...r,
          allocated: Math.round((r.allocated / total) * 100),
        }));
      }
      return updated;
    });
  };

  const monthlyIncome = parseFloat(monthlyBudget) || 0;
  const targetAmount = parseFloat(goalAmount) || 0;
  const savingsRate = resources.find((r) => r.id === "savings")?.allocated || 0;
  const monthlySavings = (monthlyIncome * savingsRate) / 100;
  const monthsToGoal = monthlySavings > 0 ? Math.ceil(targetAmount / monthlySavings) : Infinity;
  const progressPercent = monthlySavings > 0
    ? Math.min(100, (monthlySavings / targetAmount) * 100 * (monthsToGoal > 12 ? 12 : monthsToGoal))
    : 0;

  // Determine winning dog (highest allocation)
  const winningDog = resources.reduce((a, b) => (a.allocated > b.allocated ? a : b));

  if (!isSetup) {
    return (
      <Box
        p="6"
        bg="gray.900"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.800"
      >
        <VStack gap="4" align="stretch">
          <Text fontSize="xl" fontWeight="bold">
            Set Your Goal 🎯
          </Text>
          <Text color="gray.400" fontSize="sm">
            What are you saving for? Set a goal and monthly budget to see your fat dogs compete for resources!
          </Text>

          <Box>
            <Text fontSize="sm" color="gray.400" mb="1">
              Goal name
            </Text>
            <Input
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              bg="gray.800"
              borderColor="gray.700"
            />
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.400" mb="1">
              Target amount ($)
            </Text>
            <Input
              type="number"
              placeholder="10000"
              value={goalAmount || ""}
              onChange={(e) => setGoalAmount(e.target.value)}
              bg="gray.800"
              borderColor="gray.700"
            />
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.400" mb="1">
              Monthly income ($)
            </Text>
            <Input
              type="number"
              placeholder="5000"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              bg="gray.800"
              borderColor="gray.700"
            />
          </Box>

          <Button
            colorScheme="blue"
            onClick={handleSetGoal}
            disabled={!goal || !goalAmount || !monthlyBudget}
          >
            Let the Dogs Compete! 🐕
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      p="6"
      bg="gray.900"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.800"
    >
      <VStack gap="6" align="stretch">
        {/* Goal Header */}
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="bold" color="blue.300">
            🎯 {goal}
          </Text>
          <Text color="gray.400" fontSize="sm">
            Target: ${Number(targetAmount).toLocaleString()}
          </Text>
        </Box>

        {/* Monthly Progress */}
        <Box
          p="4"
          bg="gray.800"
          borderRadius="md"
        >
          <Text fontSize="sm" color="gray.400" mb="2">
            Monthly Progress to Goal
          </Text>
          <Progress.Root value={progressPercent} size="lg">
            <Progress.Track bg="gray.700">
              <Progress.Range bg="green.400" />
            </Progress.Track>
          </Progress.Root>
          <HStack justify="space-between" mt="2">
            <Text fontSize="xs" color="gray.500">
              ${monthlySavings.toFixed(0)}/month saved
            </Text>
            <Text fontSize="xs" color="green.400" fontWeight="bold">
              {monthsToGoal === Infinity ? "∞" : monthsToGoal} months to goal
            </Text>
          </HStack>
        </Box>

        {/* Fat Dogs Competition */}
        <Box>
          <Text fontSize="md" fontWeight="bold" mb="4" textAlign="center">
            🦴 Fat Dogs Fighting for Resources 🦴
          </Text>

          <HStack justify="center" gap="4" flexWrap="wrap" mb="4">
            {resources.map((resource) => (
              <VStack key={resource.id} gap="2">
                <FatDog
                  color={resource.color}
                  name={resource.dog}
                  size={50}
                  isWinning={resource.id === winningDog.id}
                  emotion={resource.allocated > 25 ? "happy" : "determined"}
                />
                <ResourceBone
                  amount={((monthlyIncome * resource.allocated) / 100).toFixed(0)}
                  label={resource.name}
                />
              </VStack>
            ))}
          </HStack>
        </Box>

        {/* Allocation Controls */}
        <Box>
          <Text fontSize="sm" color="gray.400" mb="3" textAlign="center">
            Adjust allocations - watch your dogs compete!
          </Text>
          <VStack gap="3">
            {resources.map((resource) => (
              <HStack key={resource.id} justify="space-between" w="100%">
                <HStack gap="2">
                  <Box
                    w="3"
                    h="3"
                    borderRadius="full"
                    bg={resource.color}
                  />
                  <Text fontSize="sm" color="gray.300" minW="60px">
                    {resource.name}
                  </Text>
                </HStack>

                <HStack gap="2">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => adjustAllocation(resource.id, -5)}
                    color="gray.400"
                  >
                    −
                  </Button>
                  <Text fontSize="sm" fontWeight="bold" color="white" minW="40px" textAlign="center">
                    {resource.allocated}%
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => adjustAllocation(resource.id, 5)}
                    color="gray.400"
                  >
                    +
                  </Button>
                </HStack>

                <Text fontSize="sm" color="gray.500" minW="70px" textAlign="right">
                  ${((monthlyIncome * resource.allocated) / 100).toFixed(0)}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Summary */}
        <Box
          p="4"
          bg="gray.800"
          borderRadius="md"
          textAlign="center"
        >
          <Text fontSize="sm" color="gray.400">
            At current rate, <Text as="span" color={winningDog.color} fontWeight="bold">{winningDog.dog}</Text> is winning with {winningDog.allocated}% of resources!
          </Text>
          {savingsRate >= 20 && (
            <Text fontSize="xs" color="green.400" mt="1">
              Great job prioritizing savings! 🎉
            </Text>
          )}
          {savingsRate < 10 && (
            <Text fontSize="xs" color="orange.400" mt="1">
              Consider giving Chunk (Savings) more bones! 🦴
            </Text>
          )}
        </Box>

        {/* Reset Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSetup(false)}
          color="gray.500"
        >
          Change Goal
        </Button>
      </VStack>
    </Box>
  );
}

export default MonthlyGoalChart;
