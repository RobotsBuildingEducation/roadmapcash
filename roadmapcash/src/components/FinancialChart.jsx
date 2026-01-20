import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Box, VStack, Text, HStack, Badge, ProgressRoot, ProgressTrack, ProgressRange } from "@chakra-ui/react";

// Create a cute fat dog with military uniform, sword and shield
function createMilitaryDog(color, teamColor, x, z, facingLeft = false) {
  const dogGroup = new THREE.Group();

  // Fat body (big ellipsoid)
  const bodyGeometry = new THREE.SphereGeometry(0.35, 16, 16);
  bodyGeometry.scale(1.2, 0.85, 0.9);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.8,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.3;
  dogGroup.add(body);

  // Military vest/armor
  const vestGeometry = new THREE.SphereGeometry(0.37, 16, 16);
  vestGeometry.scale(1.1, 0.6, 0.85);
  const vestMaterial = new THREE.MeshStandardMaterial({
    color: teamColor,
    metalness: 0.4,
    roughness: 0.5,
  });
  const vest = new THREE.Mesh(vestGeometry, vestMaterial);
  vest.position.y = 0.32;
  dogGroup.add(vest);

  // Round head
  const headGeometry = new THREE.SphereGeometry(0.22, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.8,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0.4, 0.42, 0);
  dogGroup.add(head);

  // Military helmet
  const helmetGeometry = new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const helmetMaterial = new THREE.MeshStandardMaterial({
    color: teamColor,
    metalness: 0.5,
    roughness: 0.4,
  });
  const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
  helmet.position.set(0.4, 0.47, 0);
  helmet.rotation.x = -0.2;
  dogGroup.add(helmet);

  // Helmet rim
  const rimGeometry = new THREE.TorusGeometry(0.24, 0.02, 8, 16);
  const rim = new THREE.Mesh(rimGeometry, helmetMaterial);
  rim.position.set(0.4, 0.45, 0);
  rim.rotation.x = Math.PI / 2;
  dogGroup.add(rim);

  // Snout
  const snoutGeometry = new THREE.SphereGeometry(0.09, 12, 12);
  snoutGeometry.scale(1.2, 0.7, 0.9);
  const snoutMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a574,
    metalness: 0.1,
    roughness: 0.9,
  });
  const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
  snout.position.set(0.58, 0.36, 0);
  dogGroup.add(snout);

  // Nose
  const noseGeometry = new THREE.SphereGeometry(0.035, 8, 8);
  const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(0.65, 0.38, 0);
  dogGroup.add(nose);

  // Eyes
  const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(0.52, 0.48, 0.1);
  dogGroup.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.52, 0.48, -0.1);
  dogGroup.add(rightEye);

  // Angry eyebrows
  const browGeometry = new THREE.BoxGeometry(0.08, 0.015, 0.02);
  const browMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
  leftBrow.position.set(0.5, 0.53, 0.1);
  leftBrow.rotation.z = -0.5;
  dogGroup.add(leftBrow);
  const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
  rightBrow.position.set(0.5, 0.53, -0.1);
  rightBrow.rotation.z = 0.5;
  dogGroup.add(rightBrow);

  // Ears
  const earGeometry = new THREE.SphereGeometry(0.08, 10, 10);
  earGeometry.scale(0.5, 1, 0.7);
  const earMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).multiplyScalar(0.7),
  });
  const leftEar = new THREE.Mesh(earGeometry, earMaterial);
  leftEar.position.set(0.28, 0.4, 0.18);
  dogGroup.add(leftEar);
  const rightEar = new THREE.Mesh(earGeometry, earMaterial);
  rightEar.position.set(0.28, 0.4, -0.18);
  dogGroup.add(rightEar);

  // Stubby legs
  const legGeometry = new THREE.CylinderGeometry(0.055, 0.07, 0.18, 8);
  const legMaterial = new THREE.MeshStandardMaterial({ color: color });
  const legPositions = [
    [0.2, 0.09, 0.18],
    [0.2, 0.09, -0.18],
    [-0.2, 0.09, 0.18],
    [-0.2, 0.09, -0.18],
  ];
  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(...pos);
    dogGroup.add(leg);
  });

  // Tail
  const tailGeometry = new THREE.SphereGeometry(0.07, 8, 8);
  const tail = new THREE.Mesh(tailGeometry, new THREE.MeshStandardMaterial({ color }));
  tail.position.set(-0.45, 0.38, 0);
  dogGroup.add(tail);

  // === SWORD ===
  const swordGroup = new THREE.Group();

  // Blade
  const bladeGeometry = new THREE.BoxGeometry(0.04, 0.5, 0.015);
  const bladeMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.9,
    roughness: 0.2,
  });
  const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
  blade.position.y = 0.25;
  swordGroup.add(blade);

  // Blade tip (pointed)
  const tipGeometry = new THREE.ConeGeometry(0.025, 0.1, 4);
  const tip = new THREE.Mesh(tipGeometry, bladeMaterial);
  tip.position.y = 0.55;
  swordGroup.add(tip);

  // Handle
  const handleGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.12, 8);
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.y = -0.06;
  swordGroup.add(handle);

  // Crossguard
  const guardGeometry = new THREE.BoxGeometry(0.15, 0.025, 0.025);
  const guardMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.7,
    roughness: 0.3,
  });
  const guard = new THREE.Mesh(guardGeometry, guardMaterial);
  guard.position.y = 0;
  swordGroup.add(guard);

  // Position sword in right paw
  swordGroup.position.set(0.35, 0.35, -0.3);
  swordGroup.rotation.z = -0.3;
  swordGroup.rotation.x = 0.2;
  dogGroup.add(swordGroup);

  // === SHIELD ===
  const shieldGroup = new THREE.Group();

  // Shield body (round)
  const shieldGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16);
  const shieldMaterial = new THREE.MeshStandardMaterial({
    color: teamColor,
    metalness: 0.4,
    roughness: 0.5,
  });
  const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
  shield.rotation.x = Math.PI / 2;
  shieldGroup.add(shield);

  // Shield rim
  const shieldRimGeometry = new THREE.TorusGeometry(0.2, 0.015, 8, 16);
  const shieldRimMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.8,
    roughness: 0.2,
  });
  const shieldRim = new THREE.Mesh(shieldRimGeometry, shieldRimMaterial);
  shieldRim.rotation.x = Math.PI / 2;
  shieldRim.position.z = 0.02;
  shieldGroup.add(shieldRim);

  // Shield boss (center bump)
  const bossGeometry = new THREE.SphereGeometry(0.06, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const bossMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.2,
  });
  const boss = new THREE.Mesh(bossGeometry, bossMaterial);
  boss.rotation.x = -Math.PI / 2;
  boss.position.z = 0.02;
  shieldGroup.add(boss);

  // Position shield in left paw
  shieldGroup.position.set(0.15, 0.3, 0.35);
  shieldGroup.rotation.y = -0.5;
  dogGroup.add(shieldGroup);

  dogGroup.position.set(x, 0, z);

  // Face the right direction
  if (facingLeft) {
    dogGroup.rotation.y = Math.PI;
  }

  return dogGroup;
}

// Create 3D bar for chart
function createBar(height, color, x) {
  const barGroup = new THREE.Group();

  const geometry = new THREE.BoxGeometry(0.5, height, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.3,
    roughness: 0.5,
  });
  const bar = new THREE.Mesh(geometry, material);
  bar.position.y = height / 2;
  barGroup.add(bar);

  // Glow effect
  const glowGeometry = new THREE.BoxGeometry(0.55, height + 0.05, 0.55);
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

// Create projection chart
function createProjectionChart(currentSavings, monthlySavings, savingsGoal, months) {
  const chartGroup = new THREE.Group();

  // Base platform
  const platformGeometry = new THREE.BoxGeometry(7, 0.08, 2.5);
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a40,
    metalness: 0.2,
    roughness: 0.8,
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = 0.04;
  chartGroup.add(platform);

  // Grid lines
  const gridMaterial = new THREE.LineBasicMaterial({ color: 0x3b3b5c, transparent: true, opacity: 0.5 });
  for (let i = 0; i <= 4; i++) {
    const points = [
      new THREE.Vector3(-3, 0.09, -1 + i * 0.5),
      new THREE.Vector3(3, 0.09, -1 + i * 0.5),
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, gridMaterial);
    chartGroup.add(line);
  }

  // Create projection bars
  const maxMonths = Math.min(months, 12);
  const barWidth = 5.5 / (maxMonths + 1);

  for (let i = 0; i <= maxMonths; i++) {
    const projectedSavings = currentSavings + (monthlySavings * i);
    const progress = savingsGoal > 0 ? Math.min(projectedSavings / savingsGoal, 1) : 0;
    const barHeight = progress * 2 + 0.1;

    const isCurrentMonth = i === 0;
    const isGoalReached = projectedSavings >= savingsGoal;

    let barColor;
    if (isCurrentMonth) {
      barColor = 0x6366f1;
    } else if (isGoalReached) {
      barColor = 0x10b981;
    } else {
      barColor = 0x3b82f6;
    }

    const barGeometry = new THREE.BoxGeometry(barWidth * 0.7, barHeight, 0.35);
    const barMaterial = new THREE.MeshStandardMaterial({
      color: barColor,
      metalness: 0.4,
      roughness: 0.4,
      emissive: barColor,
      emissiveIntensity: isGoalReached ? 0.3 : 0.1,
    });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(-2.5 + i * (5.5 / maxMonths), barHeight / 2 + 0.08, 0);
    chartGroup.add(bar);
  }

  // Goal line
  const goalLineGeometry = new THREE.BoxGeometry(6, 0.02, 0.02);
  const goalLineMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 0.5,
  });
  const goalLine = new THREE.Mesh(goalLineGeometry, goalLineMaterial);
  goalLine.position.set(0, 2.1, 0);
  chartGroup.add(goalLine);

  // Goal flag
  const flagPoleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
  const flagPoleMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
  const flagPole = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);
  flagPole.position.set(3, 2.4, 0);
  chartGroup.add(flagPole);

  const flagGeometry = new THREE.BoxGeometry(0.35, 0.2, 0.015);
  const flagMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 0.3,
  });
  const flag = new THREE.Mesh(flagGeometry, flagMaterial);
  flag.position.set(3.18, 2.6, 0);
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
    const height = 500;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f18);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 10, 18);
    camera.lookAt(0, 1, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 15, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const redLight = new THREE.PointLight(0xff4444, 0.5, 30);
    redLight.position.set(-10, 5, 5);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x4444ff, 0.5, 30);
    blueLight.position.set(10, 5, 5);
    scene.add(blueLight);

    // Ground (battlefield)
    const groundGeometry = new THREE.PlaneGeometry(40, 40);
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

    // === EXPENSE BARS ===
    const expenseColors = [0xef4444, 0xf59e0b, 0x8b5cf6, 0x06b6d4, 0xec4899, 0x3b82f6];
    const maxExpense = Math.max(...expenses.map(e => e.amount), 1);
    const barSpacing = 1;
    const startX = -((expenses.length - 1) * barSpacing) / 2;

    const expenseBars = [];
    expenses.slice(0, 6).forEach((expense, index) => {
      const normalizedHeight = (expense.amount / maxExpense) * 2.5 + 0.15;
      const bar = createBar(normalizedHeight, expenseColors[index % expenseColors.length], startX + index * barSpacing);
      bar.position.z = 6;
      scene.add(bar);
      expenseBars.push(bar);
    });

    // Income bar
    if (data.income) {
      const incomeHeight = (data.income / maxExpense) * 2.5 + 0.15;
      const incomeBar = createBar(Math.min(incomeHeight, 3.5), 0x10b981, startX - barSpacing * 1.5);
      incomeBar.position.z = 6;
      scene.add(incomeBar);
      expenseBars.push(incomeBar);
    }

    // === PROJECTION CHART ===
    const projectionChart = createProjectionChart(currentSavings, monthlySavings, savingsGoal, monthsToGoal);
    projectionChart.position.set(0, 0, -5);
    scene.add(projectionChart);

    // === 20 BATTLING DOGS - TWO ARMIES ===
    const dogColors = [0xc4a574, 0x8b6914, 0xf5f5dc, 0x4a4a4a, 0xd4956a, 0xa0522d, 0xdeb887, 0x8b4513, 0xf4a460, 0xcd853f];
    const teamRed = 0x8b0000;
    const teamBlue = 0x00008b;

    const dogs = [];
    const numDogsPerSide = 10;

    // Red Army (left side) - 10 dogs in formation
    for (let i = 0; i < numDogsPerSide; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const x = -8 - row * 1.2;
      const z = -2 + col * 1.5;

      const dog = createMilitaryDog(dogColors[i % dogColors.length], teamRed, x, z, false);
      dog.userData = {
        team: 'red',
        baseX: x,
        baseZ: z,
        targetX: 0,
        targetZ: z,
        state: 'idle',
        stateTimer: 1 + Math.random() * 2,
        speed: 0.04 + Math.random() * 0.02,
        swingOffset: Math.random() * Math.PI * 2,
        row: row,
      };
      scene.add(dog);
      dogs.push(dog);
    }

    // Blue Army (right side) - 10 dogs in formation
    for (let i = 0; i < numDogsPerSide; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const x = 8 + row * 1.2;
      const z = -2 + col * 1.5;

      const dog = createMilitaryDog(dogColors[(i + 5) % dogColors.length], teamBlue, x, z, true);
      dog.userData = {
        team: 'blue',
        baseX: x,
        baseZ: z,
        targetX: 0,
        targetZ: z,
        state: 'idle',
        stateTimer: 1.5 + Math.random() * 2,
        speed: 0.04 + Math.random() * 0.02,
        swingOffset: Math.random() * Math.PI * 2,
        row: row,
      };
      scene.add(dog);
      dogs.push(dog);
    }

    // Animation
    let animationId;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.016;

      // Animate expense bars
      expenseBars.forEach((bar, index) => {
        const pulse = 1 + Math.sin(time * 2 + index) * 0.02;
        bar.scale.y = pulse;
      });

      // Dog battle animations
      dogs.forEach((dog, index) => {
        const ud = dog.userData;
        ud.stateTimer -= 0.016;

        // Basic bounce
        const bounce = Math.sin(time * 6 + index * 0.5) * 0.02;

        // State machine
        if (ud.state === 'idle') {
          dog.position.y = bounce;
          // Slight sway
          dog.rotation.z = Math.sin(time * 2 + index) * 0.05;

          if (ud.stateTimer <= 0) {
            ud.state = 'charging';
            ud.stateTimer = 3 + Math.random() * 2;
          }
        }

        if (ud.state === 'charging') {
          // Charge toward enemy
          const targetX = ud.team === 'red' ? 1.5 + ud.row * 0.5 : -1.5 - ud.row * 0.5;
          const dx = targetX - dog.position.x;
          const dist = Math.abs(dx);

          if (dist > 0.5) {
            dog.position.x += Math.sign(dx) * ud.speed;
            // Running animation
            dog.position.y = Math.abs(Math.sin(time * 15 + index)) * 0.08;
            dog.rotation.z = Math.sin(time * 12 + index) * 0.1;

            // Sword raised while charging
            const sword = dog.children.find(c => c.children && c.children.length === 4);
            if (sword) {
              sword.rotation.z = -0.8 + Math.sin(time * 10) * 0.2;
            }
          } else {
            ud.state = 'fighting';
            ud.stateTimer = 2 + Math.random() * 1.5;
          }
        }

        if (ud.state === 'fighting') {
          // Intense fighting animation
          dog.position.y = Math.abs(Math.sin(time * 10 + index)) * 0.05;
          dog.position.x += Math.sin(time * 8 + index * 2) * 0.015;
          dog.rotation.z = Math.sin(time * 15 + index) * 0.12;

          // Sword swinging
          const sword = dog.children.find(c => c.children && c.children.length === 4);
          if (sword) {
            sword.rotation.z = -0.5 + Math.sin(time * 12 + ud.swingOffset) * 0.6;
            sword.rotation.x = 0.2 + Math.sin(time * 10 + ud.swingOffset) * 0.3;
          }

          // Shield blocking
          const shield = dog.children.find(c => c.children && c.children.length === 3);
          if (shield) {
            shield.rotation.y = -0.5 + Math.sin(time * 8 + ud.swingOffset + 1) * 0.3;
          }

          if (ud.stateTimer <= 0) {
            ud.state = 'retreating';
            ud.stateTimer = 2 + Math.random() * 2;
          }
        }

        if (ud.state === 'retreating') {
          const dx = ud.baseX - dog.position.x;
          const dist = Math.abs(dx);

          if (dist > 0.3) {
            dog.position.x += Math.sign(dx) * ud.speed * 0.6;
            dog.position.y = Math.abs(Math.sin(time * 12 + index)) * 0.06;
          } else {
            ud.state = 'idle';
            ud.stateTimer = 1 + Math.random() * 2;
          }
        }

        // Tail wag - faster when fighting
        const tail = dog.children.find(c => c.geometry?.type === 'SphereGeometry' && c.position.x < -0.4);
        if (tail) {
          const wagSpeed = ud.state === 'fighting' ? 18 : 8;
          tail.position.z = Math.sin(time * wagSpeed + index) * 0.06;
        }
      });

      // Animate flag
      const flag = projectionChart.children.find(c => c.geometry?.type === 'BoxGeometry' && c.position.y > 2.5);
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
            <Text fontSize="sm" color="gray.500">20 Warriors: Expenses vs Savings</Text>
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

        <Box ref={containerRef} borderRadius="md" overflow="hidden" minH="500px" />

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
