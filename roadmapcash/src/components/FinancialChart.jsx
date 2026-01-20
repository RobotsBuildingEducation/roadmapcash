import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Box, VStack, Text, HStack, Badge, ProgressRoot, ProgressTrack, ProgressRange } from "@chakra-ui/react";

// Create a cute fat dog with military uniform
function createMilitaryDog(color, teamColor, x, z) {
  const dogGroup = new THREE.Group();

  // Fat body (big ellipsoid)
  const bodyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  bodyGeometry.scale(1.2, 0.85, 0.9);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.8,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.4;
  dogGroup.add(body);

  // Military vest
  const vestGeometry = new THREE.SphereGeometry(0.52, 16, 16);
  vestGeometry.scale(1.1, 0.6, 0.85);
  const vestMaterial = new THREE.MeshStandardMaterial({
    color: teamColor,
    metalness: 0.3,
    roughness: 0.6,
  });
  const vest = new THREE.Mesh(vestGeometry, vestMaterial);
  vest.position.y = 0.42;
  dogGroup.add(vest);

  // Vest straps
  const strapGeometry = new THREE.BoxGeometry(0.08, 0.5, 0.08);
  const strapMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
  leftStrap.position.set(0.15, 0.45, 0.35);
  leftStrap.rotation.x = 0.3;
  dogGroup.add(leftStrap);
  const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
  rightStrap.position.set(0.15, 0.45, -0.35);
  rightStrap.rotation.x = -0.3;
  dogGroup.add(rightStrap);

  // Round head
  const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.8,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0.55, 0.55, 0);
  dogGroup.add(head);

  // Military helmet
  const helmetGeometry = new THREE.SphereGeometry(0.32, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const helmetMaterial = new THREE.MeshStandardMaterial({
    color: teamColor,
    metalness: 0.4,
    roughness: 0.5,
  });
  const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
  helmet.position.set(0.55, 0.6, 0);
  helmet.rotation.x = -0.2;
  dogGroup.add(helmet);

  // Helmet rim
  const rimGeometry = new THREE.TorusGeometry(0.32, 0.03, 8, 16);
  const rim = new THREE.Mesh(rimGeometry, helmetMaterial);
  rim.position.set(0.55, 0.58, 0);
  rim.rotation.x = Math.PI / 2;
  dogGroup.add(rim);

  // Snout
  const snoutGeometry = new THREE.SphereGeometry(0.12, 12, 12);
  snoutGeometry.scale(1.2, 0.7, 0.9);
  const snoutMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a574,
    metalness: 0.1,
    roughness: 0.9,
  });
  const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
  snout.position.set(0.8, 0.48, 0);
  dogGroup.add(snout);

  // Nose
  const noseGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(0.9, 0.5, 0);
  dogGroup.add(nose);

  // Eyes (determined look)
  const eyeGeometry = new THREE.SphereGeometry(0.06, 8, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(0.72, 0.62, 0.15);
  dogGroup.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.72, 0.62, -0.15);
  dogGroup.add(rightEye);

  // Angry eyebrows
  const browGeometry = new THREE.BoxGeometry(0.12, 0.02, 0.03);
  const browMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
  leftBrow.position.set(0.7, 0.7, 0.15);
  leftBrow.rotation.z = -0.4;
  dogGroup.add(leftBrow);
  const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
  rightBrow.position.set(0.7, 0.7, -0.15);
  rightBrow.rotation.z = 0.4;
  dogGroup.add(rightBrow);

  // Floppy ears (under helmet)
  const earGeometry = new THREE.SphereGeometry(0.12, 10, 10);
  earGeometry.scale(0.5, 1, 0.7);
  const earMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).multiplyScalar(0.7),
  });
  const leftEar = new THREE.Mesh(earGeometry, earMaterial);
  leftEar.position.set(0.4, 0.5, 0.28);
  dogGroup.add(leftEar);
  const rightEar = new THREE.Mesh(earGeometry, earMaterial);
  rightEar.position.set(0.4, 0.5, -0.28);
  dogGroup.add(rightEar);

  // Stubby legs
  const legGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.25, 8);
  const legMaterial = new THREE.MeshStandardMaterial({ color: color });
  const positions = [
    [0.3, 0.12, 0.25],
    [0.3, 0.12, -0.25],
    [-0.3, 0.12, 0.25],
    [-0.3, 0.12, -0.25],
  ];
  positions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(...pos);
    dogGroup.add(leg);
  });

  // Medal on vest
  const medalGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12);
  const medalMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.2,
  });
  const medal = new THREE.Mesh(medalGeometry, medalMaterial);
  medal.position.set(0.3, 0.5, 0.4);
  medal.rotation.x = Math.PI / 2;
  dogGroup.add(medal);

  // Tail
  const tailGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const tail = new THREE.Mesh(tailGeometry, new THREE.MeshStandardMaterial({ color }));
  tail.position.set(-0.65, 0.5, 0);
  dogGroup.add(tail);

  dogGroup.position.set(x, 0, z);
  return dogGroup;
}

// Create 3D bar for chart
function createBar(height, color, x, label) {
  const barGroup = new THREE.Group();

  const geometry = new THREE.BoxGeometry(0.6, height, 0.6);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.3,
    roughness: 0.5,
  });
  const bar = new THREE.Mesh(geometry, material);
  bar.position.y = height / 2;
  barGroup.add(bar);

  // Glow effect
  const glowGeometry = new THREE.BoxGeometry(0.65, height + 0.05, 0.65);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.15,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.y = height / 2;
  barGroup.add(glow);

  barGroup.position.x = x;
  return barGroup;
}

// Create projection line chart
function createProjectionChart(currentSavings, monthlySavings, savingsGoal, months) {
  const chartGroup = new THREE.Group();

  // Base platform
  const platformGeometry = new THREE.BoxGeometry(8, 0.1, 3);
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a40,
    metalness: 0.2,
    roughness: 0.8,
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = 0.05;
  chartGroup.add(platform);

  // Grid lines
  const gridMaterial = new THREE.LineBasicMaterial({ color: 0x3b3b5c, transparent: true, opacity: 0.5 });
  for (let i = 0; i <= 4; i++) {
    const points = [
      new THREE.Vector3(-3.5, 0.11, -1.2 + i * 0.6),
      new THREE.Vector3(3.5, 0.11, -1.2 + i * 0.6),
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, gridMaterial);
    chartGroup.add(line);
  }

  // Create projection bars (month over month)
  const maxMonths = Math.min(months, 12);
  const barWidth = 6 / (maxMonths + 1);

  for (let i = 0; i <= maxMonths; i++) {
    const projectedSavings = currentSavings + (monthlySavings * i);
    const progress = savingsGoal > 0 ? Math.min(projectedSavings / savingsGoal, 1) : 0;
    const barHeight = progress * 2.5 + 0.1;

    const isCurrentMonth = i === 0;
    const isGoalReached = projectedSavings >= savingsGoal;

    let barColor;
    if (isCurrentMonth) {
      barColor = 0x6366f1; // Current - indigo
    } else if (isGoalReached) {
      barColor = 0x10b981; // Goal reached - green
    } else {
      barColor = 0x3b82f6; // Projected - blue
    }

    const barGeometry = new THREE.BoxGeometry(barWidth * 0.7, barHeight, 0.4);
    const barMaterial = new THREE.MeshStandardMaterial({
      color: barColor,
      metalness: 0.4,
      roughness: 0.4,
      emissive: barColor,
      emissiveIntensity: isGoalReached ? 0.3 : 0.1,
    });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(-3 + i * (6 / maxMonths), barHeight / 2 + 0.1, 0);
    chartGroup.add(bar);
  }

  // Goal line
  const goalLineGeometry = new THREE.BoxGeometry(7, 0.03, 0.03);
  const goalLineMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 0.5,
  });
  const goalLine = new THREE.Mesh(goalLineGeometry, goalLineMaterial);
  goalLine.position.set(0, 2.6, 0);
  chartGroup.add(goalLine);

  // Goal flag
  const flagPoleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
  const flagPoleMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
  const flagPole = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);
  flagPole.position.set(3.5, 3, 0);
  chartGroup.add(flagPole);

  const flagGeometry = new THREE.BoxGeometry(0.4, 0.25, 0.02);
  const flagMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 0.3,
  });
  const flag = new THREE.Mesh(flagGeometry, flagMaterial);
  flag.position.set(3.7, 3.25, 0);
  chartGroup.add(flag);

  return chartGroup;
}

export function FinancialChart({ data }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 450;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x12121a);

    // Camera - focused on charts
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 8, 16);
    camera.lookAt(0, 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 12, 8);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const blueLight = new THREE.PointLight(0x6366f1, 0.6, 25);
    blueLight.position.set(-6, 5, 5);
    scene.add(blueLight);

    const greenLight = new THREE.PointLight(0x10b981, 0.4, 20);
    greenLight.position.set(6, 5, -5);
    scene.add(greenLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);

    // Calculate financial metrics
    const expenses = data.expenses || [];
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const monthlySavings = (data.income || 0) - totalExpenses;
    const savingsGoal = data.savingsGoal || 0;
    const currentSavings = data.currentSavings || 0;
    const remainingToGoal = Math.max(0, savingsGoal - currentSavings);
    const monthsToGoal = monthlySavings > 0 ? Math.ceil(remainingToGoal / monthlySavings) : 12;

    // === MAIN CHART: Expense bars ===
    const expenseColors = [
      0xef4444, // red
      0xf59e0b, // amber
      0x8b5cf6, // purple
      0x06b6d4, // cyan
      0xec4899, // pink
      0x3b82f6, // blue
    ];

    const maxExpense = Math.max(...expenses.map(e => e.amount), 1);
    const barSpacing = 1.2;
    const startX = -((expenses.length - 1) * barSpacing) / 2;

    const expenseBars = [];
    expenses.slice(0, 6).forEach((expense, index) => {
      const normalizedHeight = (expense.amount / maxExpense) * 3 + 0.2;
      const bar = createBar(normalizedHeight, expenseColors[index % expenseColors.length], startX + index * barSpacing);
      bar.position.z = 4;
      scene.add(bar);
      expenseBars.push(bar);
    });

    // Income bar (green, taller)
    if (data.income) {
      const incomeHeight = (data.income / maxExpense) * 3 + 0.2;
      const incomeBar = createBar(Math.min(incomeHeight, 4), 0x10b981, startX - barSpacing * 1.5);
      incomeBar.position.z = 4;
      scene.add(incomeBar);
      expenseBars.push(incomeBar);
    }

    // === PROJECTION CHART ===
    const projectionChart = createProjectionChart(
      currentSavings,
      monthlySavings,
      savingsGoal,
      monthsToGoal
    );
    projectionChart.position.set(0, 0, -3);
    scene.add(projectionChart);

    // === BATTLING DOGS ===
    const dogColors = [0xc4a574, 0x8b6914, 0xf5f5dc, 0x4a4a4a];
    const teamRed = 0x8b0000; // Dark red team
    const teamBlue = 0x00008b; // Dark blue team

    const dogs = [];

    // Team Red (left side) - fighting for expenses
    for (let i = 0; i < 2; i++) {
      const dog = createMilitaryDog(dogColors[i], teamRed, -7 + i * 1.5, 2 + i * 2);
      dog.rotation.y = Math.PI / 4;
      dog.userData = {
        team: 'red',
        baseX: -7 + i * 1.5,
        baseZ: 2 + i * 2,
        state: 'idle',
        chargeTime: Math.random() * 3,
        targetX: 0,
        speed: 0.03 + Math.random() * 0.02,
      };
      scene.add(dog);
      dogs.push(dog);
    }

    // Team Blue (right side) - fighting for savings
    for (let i = 0; i < 2; i++) {
      const dog = createMilitaryDog(dogColors[i + 2], teamBlue, 7 - i * 1.5, 2 + i * 2);
      dog.rotation.y = -Math.PI / 4;
      dog.userData = {
        team: 'blue',
        baseX: 7 - i * 1.5,
        baseZ: 2 + i * 2,
        state: 'idle',
        chargeTime: Math.random() * 3 + 1,
        targetX: 0,
        speed: 0.03 + Math.random() * 0.02,
      };
      scene.add(dog);
      dogs.push(dog);
    }

    // Battle zone indicator
    const battleZoneGeometry = new THREE.RingGeometry(1.5, 1.8, 32);
    const battleZoneMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const battleZone = new THREE.Mesh(battleZoneGeometry, battleZoneMaterial);
    battleZone.rotation.x = -Math.PI / 2;
    battleZone.position.set(0, 0.02, 3);
    scene.add(battleZone);

    // Animation
    let animationId;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.016;

      // Animate expense bars (subtle pulse)
      expenseBars.forEach((bar, index) => {
        const pulse = 1 + Math.sin(time * 2 + index) * 0.02;
        bar.scale.y = pulse;
      });

      // Battle zone pulse
      battleZone.material.opacity = 0.2 + Math.sin(time * 3) * 0.1;
      battleZone.scale.setScalar(1 + Math.sin(time * 2) * 0.05);

      // Dog battle animations
      dogs.forEach((dog, index) => {
        const ud = dog.userData;

        // Wobble/bounce
        dog.position.y = Math.sin(time * 4 + index) * 0.03;

        // State machine for battle
        ud.chargeTime -= 0.016;

        if (ud.state === 'idle' && ud.chargeTime <= 0) {
          ud.state = 'charging';
          ud.chargeTime = 2 + Math.random() * 2;
        }

        if (ud.state === 'charging') {
          // Charge toward battle zone
          const targetX = ud.team === 'red' ? 0 : 0;
          const targetZ = 3;
          const dx = targetX - dog.position.x;
          const dz = targetZ - dog.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist > 1.5) {
            dog.position.x += (dx / dist) * ud.speed;
            dog.position.z += (dz / dist) * ud.speed;
            // Face direction of movement
            dog.rotation.y = Math.atan2(dx, dz);
            // Running animation - bob up and down faster
            dog.position.y = Math.abs(Math.sin(time * 12 + index)) * 0.1;
            dog.rotation.z = Math.sin(time * 10 + index) * 0.1;
          } else {
            ud.state = 'fighting';
            ud.chargeTime = 1.5 + Math.random();
          }
        }

        if (ud.state === 'fighting') {
          // Fighting animation - shake and lunge
          dog.position.x += Math.sin(time * 15 + index * 2) * 0.02;
          dog.position.z += Math.cos(time * 12 + index * 3) * 0.02;
          dog.rotation.z = Math.sin(time * 20 + index) * 0.15;
          dog.rotation.x = Math.sin(time * 18 + index) * 0.1;

          if (ud.chargeTime <= 0) {
            ud.state = 'retreating';
            ud.chargeTime = 2 + Math.random() * 2;
          }
        }

        if (ud.state === 'retreating') {
          // Retreat to base
          const dx = ud.baseX - dog.position.x;
          const dz = ud.baseZ - dog.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist > 0.3) {
            dog.position.x += (dx / dist) * ud.speed * 0.7;
            dog.position.z += (dz / dist) * ud.speed * 0.7;
            dog.rotation.y = Math.atan2(dx, dz);
          } else {
            ud.state = 'idle';
            ud.chargeTime = 1 + Math.random() * 2;
            // Face the battle
            dog.rotation.y = ud.team === 'red' ? Math.PI / 4 : -Math.PI / 4;
          }
        }

        // Tail wag (faster when fighting)
        const tail = dog.children.find(c => c.position.x < -0.6 && c.position.y > 0.4);
        if (tail) {
          const wagSpeed = ud.state === 'fighting' ? 15 : 6;
          tail.position.z = Math.sin(time * wagSpeed + index) * 0.08;
        }
      });

      // Animate projection chart flag
      const flag = projectionChart.children.find(c => c.geometry?.type === 'BoxGeometry' && c.position.y > 3);
      if (flag) {
        flag.rotation.z = Math.sin(time * 4) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    sceneRef.current = { scene, renderer, animationId };

    const handleResize = () => {
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [data]);

  if (!data) return null;

  const totalExpenses = (data.expenses || []).reduce((sum, e) => sum + e.amount, 0);
  const monthlySavings = (data.income || 0) - totalExpenses;
  const savingsGoal = data.savingsGoal || 0;
  const currentSavings = data.currentSavings || 0;
  const remainingToGoal = Math.max(0, savingsGoal - currentSavings);
  const monthsToGoal = monthlySavings > 0 ? Math.ceil(remainingToGoal / monthlySavings) : null;
  const progressPercent = savingsGoal ? Math.min((currentSavings / savingsGoal) * 100, 100) : 0;

  return (
    <Box p="6" bg="gray.900" borderRadius="lg" borderWidth="1px" borderColor="gray.800">
      <VStack align="stretch" gap="4">
        <HStack justify="space-between" align="center" flexWrap="wrap" gap="2">
          <VStack align="start" gap="0">
            <Text fontSize="xl" fontWeight="bold">Financial Battle Plan</Text>
            <Text fontSize="sm" color="gray.500">Expenses vs Savings - Month over Month</Text>
          </VStack>
          {monthsToGoal !== null && monthsToGoal !== Infinity && (
            <Badge
              colorScheme={monthsToGoal <= 6 ? "green" : monthsToGoal <= 12 ? "blue" : "purple"}
              fontSize="sm" px="3" py="1" borderRadius="full"
            >
              {monthsToGoal} {monthsToGoal === 1 ? "month" : "months"} to victory
            </Badge>
          )}
        </HStack>

        {savingsGoal > 0 && (
          <Box>
            <HStack justify="space-between" mb="1">
              <Text fontSize="sm" color="gray.400">
                Progress to ${savingsGoal.toLocaleString()} goal
              </Text>
              <Text fontSize="sm" color="green.400" fontWeight="bold">
                {progressPercent.toFixed(1)}%
              </Text>
            </HStack>
            <ProgressRoot value={progressPercent} size="sm" borderRadius="full">
              <ProgressTrack bg="gray.700">
                <ProgressRange bg="green.500" />
              </ProgressTrack>
            </ProgressRoot>
          </Box>
        )}

        <Box ref={containerRef} borderRadius="md" overflow="hidden" minH="450px" />

        <HStack justify="space-between" flexWrap="wrap" gap="4" pt="2">
          <VStack align="start" gap="1">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase">Monthly Income</Text>
            <Text color="green.400" fontSize="lg" fontWeight="bold">
              ${(data.income || 0).toLocaleString()}
            </Text>
          </VStack>

          <VStack align="start" gap="1">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase">Total Expenses</Text>
            <Text color="red.400" fontSize="lg" fontWeight="bold">
              ${totalExpenses.toLocaleString()}
            </Text>
          </VStack>

          <VStack align="start" gap="1">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase">Monthly Savings</Text>
            <Text color={monthlySavings >= 0 ? "blue.400" : "red.400"} fontSize="lg" fontWeight="bold">
              ${monthlySavings.toLocaleString()}
            </Text>
          </VStack>

          {savingsGoal > 0 && (
            <VStack align="start" gap="1">
              <Text color="gray.500" fontSize="xs" textTransform="uppercase">Remaining to Goal</Text>
              <Text color="purple.400" fontSize="lg" fontWeight="bold">
                ${remainingToGoal.toLocaleString()}
              </Text>
            </VStack>
          )}
        </HStack>

        {monthsToGoal !== null && monthsToGoal !== Infinity && savingsGoal > 0 && (
          <Box p="4" bg="gray.800" borderRadius="md" borderWidth="1px" borderColor="gray.700">
            <HStack gap="3" align="start">
              <Text fontSize="2xl">⚔️</Text>
              <VStack align="start" gap="1">
                <Text fontWeight="bold" color="white">Monthly Projection</Text>
                <Text fontSize="sm" color="gray.400">
                  At ${monthlySavings.toLocaleString()}/month, you'll reach your $
                  {savingsGoal.toLocaleString()} goal in{" "}
                  <Text as="span" color="green.400" fontWeight="bold">
                    {monthsToGoal} {monthsToGoal === 1 ? "month" : "months"}
                  </Text>
                </Text>
                <HStack gap="4" pt="2" fontSize="xs" color="gray.500">
                  <HStack gap="1">
                    <Box w="3" h="3" bg="indigo.500" borderRadius="sm" />
                    <Text>Current</Text>
                  </HStack>
                  <HStack gap="1">
                    <Box w="3" h="3" bg="blue.500" borderRadius="sm" />
                    <Text>Projected</Text>
                  </HStack>
                  <HStack gap="1">
                    <Box w="3" h="3" bg="green.500" borderRadius="sm" />
                    <Text>Goal Reached</Text>
                  </HStack>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        )}

        {data.expenses && data.expenses.length > 0 && (
          <Box pt="2">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase" mb="2">
              Expense Categories (Enemy Forces)
            </Text>
            <HStack flexWrap="wrap" gap="2">
              {data.expenses.map((expense, index) => (
                <Badge
                  key={index}
                  variant="subtle"
                  colorScheme={["red", "yellow", "purple", "cyan", "pink", "blue"][index % 6]}
                  px="3" py="1" borderRadius="full"
                >
                  {expense.name}: ${expense.amount.toLocaleString()}
                </Badge>
              ))}
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
