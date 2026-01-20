import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Box, VStack, Text, HStack, Badge } from "@chakra-ui/react";

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
    scene.background = new THREE.Color(0x0d0d0d);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x6366f1, 1, 50);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Ground plane with grid
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      transparent: true,
      opacity: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x3b3b5c, 0x2a2a40);
    scene.add(gridHelper);

    // Create expense bars
    const bars = [];
    const expenses = data.expenses || [];
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const maxAmount = Math.max(...expenses.map((e) => e.amount), data.income || 1);

    const barWidth = 1;
    const spacing = 1.8;
    const startX = -((expenses.length - 1) * spacing) / 2;

    // Color palette for bars
    const colors = [
      0x3b82f6, // blue
      0x8b5cf6, // purple
      0x06b6d4, // cyan
      0x10b981, // emerald
      0xf59e0b, // amber
      0xef4444, // red
      0xec4899, // pink
      0x6366f1, // indigo
    ];

    expenses.forEach((expense, index) => {
      const normalizedHeight = (expense.amount / maxAmount) * 6;
      const geometry = new THREE.BoxGeometry(barWidth, normalizedHeight, barWidth);
      const material = new THREE.MeshStandardMaterial({
        color: colors[index % colors.length],
        metalness: 0.3,
        roughness: 0.4,
      });

      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = startX + index * spacing;
      bar.position.y = normalizedHeight / 2;
      bar.position.z = 0;

      // Add glow effect
      const glowGeometry = new THREE.BoxGeometry(
        barWidth + 0.1,
        normalizedHeight + 0.1,
        barWidth + 0.1
      );
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: colors[index % colors.length],
        transparent: true,
        opacity: 0.2,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(bar.position);

      scene.add(bar);
      scene.add(glow);
      bars.push({ bar, glow, targetHeight: normalizedHeight });
    });

    // Progress ring for savings goal
    if (data.savingsGoal && data.currentSavings !== undefined) {
      const progress = Math.min(data.currentSavings / data.savingsGoal, 1);

      // Outer ring (goal)
      const outerRingGeometry = new THREE.TorusGeometry(2.5, 0.15, 16, 100);
      const outerRingMaterial = new THREE.MeshStandardMaterial({
        color: 0x3b3b5c,
        metalness: 0.5,
        roughness: 0.3,
      });
      const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
      outerRing.position.set(8, 3, 0);
      outerRing.rotation.y = Math.PI / 4;
      scene.add(outerRing);

      // Progress ring
      const progressAngle = progress * Math.PI * 2;
      const progressRingGeometry = new THREE.TorusGeometry(
        2.5,
        0.25,
        16,
        Math.max(3, Math.floor(100 * progress)),
        progressAngle
      );
      const progressRingMaterial = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.6,
        roughness: 0.2,
        emissive: 0x10b981,
        emissiveIntensity: 0.3,
      });
      const progressRing = new THREE.Mesh(progressRingGeometry, progressRingMaterial);
      progressRing.position.set(8, 3, 0);
      progressRing.rotation.y = Math.PI / 4;
      progressRing.rotation.z = -Math.PI / 2;
      scene.add(progressRing);

      // Center sphere
      const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: progress >= 1 ? 0x10b981 : 0x6366f1,
        metalness: 0.7,
        roughness: 0.2,
        emissive: progress >= 1 ? 0x10b981 : 0x6366f1,
        emissiveIntensity: 0.4,
      });
      const centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      centerSphere.position.set(8, 3, 0);
      scene.add(centerSphere);
    }

    // Floating particles
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = Math.random() * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation
    let animationId;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      // Rotate scene slowly
      scene.rotation.y = Math.sin(time * 0.2) * 0.1;

      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + i) * 0.002;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Pulse bars
      bars.forEach(({ bar, glow }, index) => {
        const pulse = 1 + Math.sin(time * 2 + index * 0.5) * 0.02;
        bar.scale.x = pulse;
        bar.scale.z = pulse;
        glow.scale.x = pulse * 1.1;
        glow.scale.z = pulse * 1.1;
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
  const progressPercent = data.savingsGoal
    ? Math.min(((data.currentSavings || 0) / data.savingsGoal) * 100, 100)
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
          {data.savingsGoal && (
            <Badge
              colorScheme={progressPercent >= 100 ? "green" : "blue"}
              fontSize="sm"
              px="3"
              py="1"
              borderRadius="full"
            >
              {progressPercent.toFixed(1)}% to goal
            </Badge>
          )}
        </HStack>

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

          {data.savingsGoal && (
            <VStack align="start" gap="1">
              <Text color="gray.500" fontSize="xs" textTransform="uppercase">
                Savings Goal
              </Text>
              <Text color="purple.400" fontSize="lg" fontWeight="bold">
                ${data.savingsGoal.toLocaleString()}
              </Text>
            </VStack>
          )}
        </HStack>

        {data.expenses && data.expenses.length > 0 && (
          <Box pt="2">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase" mb="2">
              Expense Breakdown
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
