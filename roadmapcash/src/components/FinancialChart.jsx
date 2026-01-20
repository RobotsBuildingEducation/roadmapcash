import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Box, VStack, Text, HStack, Badge, Progress } from "@chakra-ui/react";

// Create a cute fat dog mesh
function createFatDog(color, x, z) {
  const dogGroup = new THREE.Group();

  // Fat body (big ellipsoid)
  const bodyGeometry = new THREE.SphereGeometry(0.6, 16, 16);
  bodyGeometry.scale(1.3, 0.9, 1);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.8,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.5;
  dogGroup.add(body);

  // Round head
  const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.8,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0.7, 0.7, 0);
  dogGroup.add(head);

  // Snout
  const snoutGeometry = new THREE.SphereGeometry(0.15, 12, 12);
  snoutGeometry.scale(1.2, 0.8, 1);
  const snoutMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a574,
    metalness: 0.1,
    roughness: 0.9,
  });
  const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
  snout.position.set(1.0, 0.6, 0);
  dogGroup.add(snout);

  // Nose
  const noseGeometry = new THREE.SphereGeometry(0.06, 8, 8);
  const noseMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.3,
    roughness: 0.5,
  });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(1.12, 0.62, 0);
  dogGroup.add(nose);

  // Eyes
  const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.5,
    roughness: 0.3,
  });
  const eyeWhiteGeometry = new THREE.SphereGeometry(0.03, 6, 6);
  const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 1,
  });

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(0.9, 0.82, 0.2);
  dogGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.9, 0.82, -0.2);
  dogGroup.add(rightEye);

  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
  leftEyeWhite.position.set(0.95, 0.85, 0.22);
  dogGroup.add(leftEyeWhite);

  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
  rightEyeWhite.position.set(0.95, 0.85, -0.18);
  dogGroup.add(rightEyeWhite);

  // Floppy ears
  const earGeometry = new THREE.SphereGeometry(0.18, 10, 10);
  earGeometry.scale(0.6, 1.2, 0.8);
  const earMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).multiplyScalar(0.7),
    metalness: 0.1,
    roughness: 0.9,
  });

  const leftEar = new THREE.Mesh(earGeometry, earMaterial);
  leftEar.position.set(0.5, 0.85, 0.35);
  leftEar.rotation.z = 0.3;
  dogGroup.add(leftEar);

  const rightEar = new THREE.Mesh(earGeometry, earMaterial);
  rightEar.position.set(0.5, 0.85, -0.35);
  rightEar.rotation.z = 0.3;
  dogGroup.add(rightEar);

  // Stubby legs
  const legGeometry = new THREE.CylinderGeometry(0.12, 0.14, 0.3, 8);
  const legMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.8,
  });

  const positions = [
    [0.4, 0.15, 0.35],
    [0.4, 0.15, -0.35],
    [-0.4, 0.15, 0.35],
    [-0.4, 0.15, -0.35],
  ];

  positions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(...pos);
    dogGroup.add(leg);
  });

  // Curly tail
  const tailGeometry = new THREE.SphereGeometry(0.15, 8, 8);
  const tailMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.8,
  });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.position.set(-0.85, 0.7, 0);
  dogGroup.add(tail);

  // Tongue (sticking out - very cute!)
  const tongueGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  tongueGeometry.scale(1.5, 0.4, 0.8);
  const tongueMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b9d,
    metalness: 0.2,
    roughness: 0.6,
  });
  const tongue = new THREE.Mesh(tongueGeometry, tongueMaterial);
  tongue.position.set(1.05, 0.48, 0);
  dogGroup.add(tongue);

  dogGroup.position.set(x, 0, z);

  return dogGroup;
}

// Create a bone treat
function createBone(color, x, z, size = 1) {
  const boneGroup = new THREE.Group();

  // Shaft
  const shaftGeometry = new THREE.CylinderGeometry(0.08 * size, 0.08 * size, 0.4 * size, 8);
  shaftGeometry.rotateZ(Math.PI / 2);
  const boneMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.2,
    roughness: 0.7,
    emissive: color,
    emissiveIntensity: 0.2,
  });
  const shaft = new THREE.Mesh(shaftGeometry, boneMaterial);
  boneGroup.add(shaft);

  // End caps
  const capGeometry = new THREE.SphereGeometry(0.12 * size, 8, 8);
  const leftCap = new THREE.Mesh(capGeometry, boneMaterial);
  leftCap.position.set(-0.2 * size, 0, 0);
  boneGroup.add(leftCap);

  const rightCap = new THREE.Mesh(capGeometry, boneMaterial);
  rightCap.position.set(0.2 * size, 0, 0);
  boneGroup.add(rightCap);

  boneGroup.position.set(x, 0.15 * size, z);

  return boneGroup;
}

// Create a food bowl
function createFoodBowl(color, x, z, fillLevel = 0.5) {
  const bowlGroup = new THREE.Group();

  // Bowl outer
  const bowlGeometry = new THREE.CylinderGeometry(0.5, 0.3, 0.3, 16);
  const bowlMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a5c,
    metalness: 0.6,
    roughness: 0.3,
  });
  const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial);
  bowl.position.y = 0.15;
  bowlGroup.add(bowl);

  // Food inside
  if (fillLevel > 0) {
    const foodGeometry = new THREE.CylinderGeometry(0.4 * fillLevel + 0.1, 0.25, 0.15, 16);
    const foodMaterial = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.1,
      roughness: 0.9,
      emissive: color,
      emissiveIntensity: 0.15,
    });
    const food = new THREE.Mesh(foodGeometry, foodMaterial);
    food.position.y = 0.22;
    bowlGroup.add(food);
  }

  bowlGroup.position.set(x, 0, z);
  return bowlGroup;
}

export function FinancialChart({ data }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 400;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera - adjusted for better view of dogs and timeline
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 6, 14);
    camera.lookAt(0, 1, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const warmLight = new THREE.PointLight(0xffa500, 0.5, 20);
    warmLight.position.set(-5, 4, 3);
    scene.add(warmLight);

    // Ground - grassy park
    const groundGeometry = new THREE.CircleGeometry(12, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d5a3d,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Calculate financial metrics
    const expenses = data.expenses || [];
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const monthlySavings = (data.income || 0) - totalExpenses;
    const savingsGoal = data.savingsGoal || 0;
    const currentSavings = data.currentSavings || 0;
    const remainingToGoal = Math.max(0, savingsGoal - currentSavings);
    const monthsToGoal = monthlySavings > 0 ? Math.ceil(remainingToGoal / monthlySavings) : Infinity;

    // Dog colors - cute fat dogs!
    const dogColors = [
      0xc4a574, // golden/tan
      0x8b6914, // brown
      0xf5f5dc, // cream
      0x4a4a4a, // gray
      0xd4956a, // corgi orange
    ];

    // Create dogs based on expense categories (dogs competing for resources)
    const dogs = [];
    const numDogs = Math.min(expenses.length + 1, 5); // Max 5 dogs

    for (let i = 0; i < numDogs; i++) {
      const angle = (i / numDogs) * Math.PI * 2 - Math.PI / 2;
      const radius = 3.5 + Math.random() * 0.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const dog = createFatDog(dogColors[i % dogColors.length], x, z);
      dog.rotation.y = -angle + Math.PI / 2; // Face center
      dog.userData = {
        baseX: x,
        baseZ: z,
        angle: angle,
        speed: 0.3 + Math.random() * 0.3,
        wobbleOffset: Math.random() * Math.PI * 2,
      };
      scene.add(dog);
      dogs.push(dog);
    }

    // Color palette for resources
    const resourceColors = [
      0x3b82f6, // blue
      0x8b5cf6, // purple
      0x06b6d4, // cyan
      0x10b981, // emerald
      0xf59e0b, // amber
      0xef4444, // red
      0xec4899, // pink
    ];

    // Create food bowls representing expenses (resources dogs compete for)
    const bowls = [];
    expenses.slice(0, 6).forEach((expense, index) => {
      const angle = (index / Math.min(expenses.length, 6)) * Math.PI * 2;
      const radius = 1.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const fillLevel = Math.min(expense.amount / (data.income || 1), 1);
      const bowl = createFoodBowl(resourceColors[index % resourceColors.length], x, z, fillLevel);
      scene.add(bowl);
      bowls.push(bowl);
    });

    // Create progress path/timeline toward goal
    const pathGroup = new THREE.Group();

    // Main path line
    const pathLength = 10;
    const pathGeometry = new THREE.BoxGeometry(pathLength, 0.1, 0.8);
    const pathMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b3b5c,
      metalness: 0.3,
      roughness: 0.7,
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.position.set(0, 0.05, -5);
    pathGroup.add(path);

    // Progress on path (how far along to goal)
    const progress = savingsGoal > 0 ? Math.min(currentSavings / savingsGoal, 1) : 0;
    const progressLength = pathLength * progress;
    if (progressLength > 0.1) {
      const progressGeometry = new THREE.BoxGeometry(progressLength, 0.15, 0.85);
      const progressMaterial = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.4,
        roughness: 0.5,
        emissive: 0x10b981,
        emissiveIntensity: 0.3,
      });
      const progressBar = new THREE.Mesh(progressGeometry, progressMaterial);
      progressBar.position.set(-pathLength / 2 + progressLength / 2, 0.08, -5);
      pathGroup.add(progressBar);
    }

    // Milestone markers (months)
    const maxMonthsToShow = Math.min(monthsToGoal === Infinity ? 12 : monthsToGoal, 12);
    for (let i = 0; i <= maxMonthsToShow; i += Math.max(1, Math.floor(maxMonthsToShow / 6))) {
      const x = -pathLength / 2 + (i / maxMonthsToShow) * pathLength;
      const markerGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
      const isReached = savingsGoal > 0 && currentSavings >= (savingsGoal * i) / maxMonthsToShow;
      const markerMaterial = new THREE.MeshStandardMaterial({
        color: isReached ? 0x10b981 : 0x6366f1,
        metalness: 0.5,
        roughness: 0.3,
        emissive: isReached ? 0x10b981 : 0x6366f1,
        emissiveIntensity: 0.2,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, 0.25, -5);
      pathGroup.add(marker);
    }

    // Goal flag at the end
    const flagPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const flagPoleMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const flagPole = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);
    flagPole.position.set(pathLength / 2, 0.75, -5);
    pathGroup.add(flagPole);

    const flagGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.05);
    const flagMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.3,
      roughness: 0.6,
      emissive: 0xffd700,
      emissiveIntensity: 0.3,
    });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(pathLength / 2 + 0.3, 1.3, -5);
    pathGroup.add(flag);

    // Goal bone at the end (big reward!)
    const goalBone = createBone(0xffd700, pathLength / 2, -5, 2);
    goalBone.position.y = 0.5;
    pathGroup.add(goalBone);

    scene.add(pathGroup);

    // Scatter some bonus bones around
    const bonusResources = [];
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 2;
      const bone = createBone(
        resourceColors[Math.floor(Math.random() * resourceColors.length)],
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0.7
      );
      bone.rotation.y = Math.random() * Math.PI;
      scene.add(bone);
      bonusResources.push(bone);
    }

    // Animation
    let animationId;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.016;

      // Animate dogs - wobble, look around, occasionally move
      dogs.forEach((dog, index) => {
        const wobble = Math.sin(time * 2 + dog.userData.wobbleOffset) * 0.05;
        dog.position.y = wobble;

        // Body bounce when "walking"
        dog.rotation.z = Math.sin(time * 4 + dog.userData.wobbleOffset) * 0.03;

        // Dogs slowly circle, competing for resources
        const circleSpeed = dog.userData.speed * 0.1;
        const newAngle = dog.userData.angle + time * circleSpeed;
        const radius = 3.5 + Math.sin(time * 0.5 + index) * 0.5;
        dog.position.x = Math.cos(newAngle) * radius;
        dog.position.z = Math.sin(newAngle) * radius;
        dog.rotation.y = -newAngle + Math.PI / 2;

        // Tail wag (find tail and animate)
        const tail = dog.children.find(
          (c) => c.position.x < -0.8 && c.position.y > 0.5
        );
        if (tail) {
          tail.position.z = Math.sin(time * 8 + index) * 0.1;
        }
      });

      // Animate bowls - subtle float
      bowls.forEach((bowl, index) => {
        bowl.position.y = Math.sin(time * 1.5 + index) * 0.02;
      });

      // Animate flag wave
      flag.rotation.z = Math.sin(time * 3) * 0.1;
      flag.position.x = pathLength / 2 + 0.3 + Math.sin(time * 3) * 0.02;

      // Animate goal bone spin
      goalBone.rotation.y = time * 0.5;
      goalBone.position.y = 0.5 + Math.sin(time * 2) * 0.1;

      // Animate bonus bones
      bonusResources.forEach((bone, index) => {
        bone.rotation.y += 0.01;
        bone.position.y = 0.15 + Math.sin(time * 2 + index * 2) * 0.05;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Store scene ref for cleanup
    sceneRef.current = { scene, renderer, animationId };

    // Handle resize
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

      // Dispose of all geometries and materials
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
  const monthsToGoal =
    monthlySavings > 0 ? Math.ceil(remainingToGoal / monthlySavings) : null;
  const progressPercent = savingsGoal
    ? Math.min((currentSavings / savingsGoal) * 100, 100)
    : 0;

  return (
    <Box
      p="6"
      bg="gray.900"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.800"
    >
      <VStack align="stretch" gap="4">
        <HStack justify="space-between" align="center" flexWrap="wrap" gap="2">
          <Text fontSize="xl" fontWeight="bold">
            Your Financial Roadmap
          </Text>
          {monthsToGoal !== null && monthsToGoal !== Infinity && (
            <Badge
              colorScheme={monthsToGoal <= 6 ? "green" : monthsToGoal <= 12 ? "blue" : "purple"}
              fontSize="sm"
              px="3"
              py="1"
              borderRadius="full"
            >
              {monthsToGoal} {monthsToGoal === 1 ? "month" : "months"} to goal
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
            <Progress
              value={progressPercent}
              colorScheme="green"
              size="sm"
              borderRadius="full"
              bg="gray.700"
            />
          </Box>
        )}

        <Box
          ref={containerRef}
          borderRadius="md"
          overflow="hidden"
          minH="400px"
        />

        <HStack justify="space-between" flexWrap="wrap" gap="4" pt="2">
          <VStack align="start" gap="1">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase">
              Monthly Income
            </Text>
            <Text color="green.400" fontSize="lg" fontWeight="bold">
              ${(data.income || 0).toLocaleString()}
            </Text>
          </VStack>

          <VStack align="start" gap="1">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase">
              Total Expenses
            </Text>
            <Text color="red.400" fontSize="lg" fontWeight="bold">
              ${totalExpenses.toLocaleString()}
            </Text>
          </VStack>

          <VStack align="start" gap="1">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase">
              Monthly Savings
            </Text>
            <Text
              color={monthlySavings >= 0 ? "blue.400" : "red.400"}
              fontSize="lg"
              fontWeight="bold"
            >
              ${monthlySavings.toLocaleString()}
            </Text>
          </VStack>

          {savingsGoal > 0 && (
            <VStack align="start" gap="1">
              <Text color="gray.500" fontSize="xs" textTransform="uppercase">
                Remaining to Goal
              </Text>
              <Text color="purple.400" fontSize="lg" fontWeight="bold">
                ${remainingToGoal.toLocaleString()}
              </Text>
            </VStack>
          )}
        </HStack>

        {monthsToGoal !== null && monthsToGoal !== Infinity && savingsGoal > 0 && (
          <Box
            p="4"
            bg="gray.800"
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <HStack gap="3" align="center">
              <Text fontSize="2xl">🐕</Text>
              <VStack align="start" gap="0">
                <Text fontWeight="bold" color="white">
                  Monthly Progress Plan
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Save ${monthlySavings.toLocaleString()}/month to reach your $
                  {savingsGoal.toLocaleString()} goal in{" "}
                  <Text as="span" color="green.400" fontWeight="bold">
                    {monthsToGoal} {monthsToGoal === 1 ? "month" : "months"}
                  </Text>
                </Text>
              </VStack>
            </HStack>
          </Box>
        )}

        {data.expenses && data.expenses.length > 0 && (
          <Box pt="2">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase" mb="2">
              Resources Being Competed For (Expenses)
            </Text>
            <HStack flexWrap="wrap" gap="2">
              {data.expenses.map((expense, index) => (
                <Badge
                  key={index}
                  variant="subtle"
                  colorScheme={
                    ["blue", "purple", "cyan", "green", "yellow", "red", "pink"][
                      index % 7
                    ]
                  }
                  px="3"
                  py="1"
                  borderRadius="full"
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
