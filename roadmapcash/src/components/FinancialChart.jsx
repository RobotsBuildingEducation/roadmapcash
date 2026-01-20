import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Box, VStack, Text, HStack, Badge, ProgressRoot, ProgressTrack, ProgressRange } from "@chakra-ui/react";

// Create base dog body (shared between warrior and archer)
function createDogBase(color, teamColor) {
  const dogGroup = new THREE.Group();

  // Fat body
  const bodyGeometry = new THREE.SphereGeometry(0.35, 16, 16);
  bodyGeometry.scale(1.2, 0.85, 0.9);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.1, roughness: 0.8 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.3;
  dogGroup.add(body);

  // Military vest/armor
  const vestGeometry = new THREE.SphereGeometry(0.37, 16, 16);
  vestGeometry.scale(1.1, 0.6, 0.85);
  const vestMaterial = new THREE.MeshStandardMaterial({ color: teamColor, metalness: 0.4, roughness: 0.5 });
  const vest = new THREE.Mesh(vestGeometry, vestMaterial);
  vest.position.y = 0.32;
  dogGroup.add(vest);

  // Round head
  const headGeometry = new THREE.SphereGeometry(0.22, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.1, roughness: 0.8 });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0.4, 0.42, 0);
  dogGroup.add(head);

  // Military helmet
  const helmetGeometry = new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const helmetMaterial = new THREE.MeshStandardMaterial({ color: teamColor, metalness: 0.5, roughness: 0.4 });
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
  const snoutMaterial = new THREE.MeshStandardMaterial({ color: 0xd4a574, metalness: 0.1, roughness: 0.9 });
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
  const earMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.7) });
  const leftEar = new THREE.Mesh(earGeometry, earMaterial);
  leftEar.position.set(0.28, 0.4, 0.18);
  dogGroup.add(leftEar);
  const rightEar = new THREE.Mesh(earGeometry, earMaterial);
  rightEar.position.set(0.28, 0.4, -0.18);
  dogGroup.add(rightEar);

  // Stubby legs
  const legGeometry = new THREE.CylinderGeometry(0.055, 0.07, 0.18, 8);
  const legMaterial = new THREE.MeshStandardMaterial({ color });
  [[0.2, 0.09, 0.18], [0.2, 0.09, -0.18], [-0.2, 0.09, 0.18], [-0.2, 0.09, -0.18]].forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(...pos);
    dogGroup.add(leg);
  });

  // Tail
  const tailGeometry = new THREE.SphereGeometry(0.07, 8, 8);
  const tail = new THREE.Mesh(tailGeometry, new THREE.MeshStandardMaterial({ color }));
  tail.position.set(-0.45, 0.38, 0);
  dogGroup.add(tail);

  return dogGroup;
}

// Create warrior dog with sword and shield
function createWarriorDog(color, teamColor, x, z, facingLeft = false) {
  const dogGroup = createDogBase(color, teamColor);

  // === SWORD ===
  const swordGroup = new THREE.Group();
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.2 });

  const bladeGeometry = new THREE.BoxGeometry(0.04, 0.5, 0.015);
  const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
  blade.position.y = 0.25;
  swordGroup.add(blade);

  const tipGeometry = new THREE.ConeGeometry(0.025, 0.1, 4);
  const tip = new THREE.Mesh(tipGeometry, bladeMaterial);
  tip.position.y = 0.55;
  swordGroup.add(tip);

  const handleGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.12, 8);
  const handle = new THREE.Mesh(handleGeometry, new THREE.MeshStandardMaterial({ color: 0x4a3728 }));
  handle.position.y = -0.06;
  swordGroup.add(handle);

  const guardGeometry = new THREE.BoxGeometry(0.15, 0.025, 0.025);
  const guard = new THREE.Mesh(guardGeometry, new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.7, roughness: 0.3 }));
  guard.position.y = 0;
  swordGroup.add(guard);

  swordGroup.position.set(0.35, 0.35, -0.3);
  swordGroup.rotation.z = -0.3;
  swordGroup.rotation.x = 0.2;
  dogGroup.add(swordGroup);

  // === SHIELD ===
  const shieldGroup = new THREE.Group();

  const shieldGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16);
  const shieldMaterial = new THREE.MeshStandardMaterial({ color: teamColor, metalness: 0.4, roughness: 0.5 });
  const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
  shield.rotation.x = Math.PI / 2;
  shieldGroup.add(shield);

  const shieldRimGeometry = new THREE.TorusGeometry(0.2, 0.015, 8, 16);
  const shieldRim = new THREE.Mesh(shieldRimGeometry, new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 }));
  shieldRim.rotation.x = Math.PI / 2;
  shieldRim.position.z = 0.02;
  shieldGroup.add(shieldRim);

  const bossGeometry = new THREE.SphereGeometry(0.06, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const boss = new THREE.Mesh(bossGeometry, new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 }));
  boss.rotation.x = -Math.PI / 2;
  boss.position.z = 0.02;
  shieldGroup.add(boss);

  shieldGroup.position.set(0.15, 0.3, 0.35);
  shieldGroup.rotation.y = -0.5;
  dogGroup.add(shieldGroup);

  dogGroup.position.set(x, 0, z);
  if (facingLeft) dogGroup.rotation.y = Math.PI;

  return dogGroup;
}

// Create archer dog with bow
function createArcherDog(color, teamColor, x, z, facingLeft = false) {
  const dogGroup = createDogBase(color, teamColor);

  // === BOW ===
  const bowGroup = new THREE.Group();

  // Bow curve (using a torus segment)
  const bowCurve = new THREE.TorusGeometry(0.3, 0.02, 8, 16, Math.PI);
  const bowMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, metalness: 0.2, roughness: 0.8 });
  const bow = new THREE.Mesh(bowCurve, bowMaterial);
  bow.rotation.z = Math.PI / 2;
  bowGroup.add(bow);

  // Bowstring
  const stringMaterial = new THREE.LineBasicMaterial({ color: 0xf5f5dc });
  const stringPoints = [
    new THREE.Vector3(0, 0.3, 0),
    new THREE.Vector3(0.1, 0, 0),
    new THREE.Vector3(0, -0.3, 0),
  ];
  const stringGeometry = new THREE.BufferGeometry().setFromPoints(stringPoints);
  const bowstring = new THREE.Line(stringGeometry, stringMaterial);
  bowGroup.add(bowstring);

  // Arrow nocked on bow
  const arrowGroup = new THREE.Group();

  // Arrow shaft
  const shaftGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.4, 8);
  const shaftMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
  shaft.rotation.z = Math.PI / 2;
  arrowGroup.add(shaft);

  // Arrow head
  const arrowHeadGeometry = new THREE.ConeGeometry(0.025, 0.08, 6);
  const arrowHeadMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.3 });
  const arrowHead = new THREE.Mesh(arrowHeadGeometry, arrowHeadMaterial);
  arrowHead.rotation.z = -Math.PI / 2;
  arrowHead.position.x = 0.24;
  arrowGroup.add(arrowHead);

  // Arrow fletching
  const fletchGeometry = new THREE.BoxGeometry(0.08, 0.04, 0.005);
  const fletchMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
  const fletch1 = new THREE.Mesh(fletchGeometry, fletchMaterial);
  fletch1.position.set(-0.15, 0, 0);
  arrowGroup.add(fletch1);
  const fletch2 = new THREE.Mesh(fletchGeometry, fletchMaterial);
  fletch2.position.set(-0.15, 0, 0);
  fletch2.rotation.x = Math.PI / 2;
  arrowGroup.add(fletch2);

  arrowGroup.position.x = 0.1;
  bowGroup.add(arrowGroup);

  // Position bow
  bowGroup.position.set(0.3, 0.4, 0);
  bowGroup.rotation.y = -0.3;
  dogGroup.add(bowGroup);

  // === QUIVER ===
  const quiverGroup = new THREE.Group();

  // Quiver body
  const quiverGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.3, 8);
  const quiverMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
  const quiver = new THREE.Mesh(quiverGeometry, quiverMaterial);
  quiverGroup.add(quiver);

  // Arrows in quiver
  for (let i = 0; i < 3; i++) {
    const qArrowGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6);
    const qArrow = new THREE.Mesh(qArrowGeometry, new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
    qArrow.position.set(0.02 * (i - 1), 0.15, 0.02 * (i - 1));
    quiverGroup.add(qArrow);
  }

  quiverGroup.position.set(-0.35, 0.35, 0.1);
  quiverGroup.rotation.z = 0.3;
  dogGroup.add(quiverGroup);

  dogGroup.position.set(x, 0, z);
  if (facingLeft) dogGroup.rotation.y = Math.PI;

  return dogGroup;
}

// Create flying arrow
function createArrow(teamColor) {
  const arrowGroup = new THREE.Group();

  // Shaft
  const shaftGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8);
  const shaftMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
  shaft.rotation.z = Math.PI / 2;
  arrowGroup.add(shaft);

  // Arrow head
  const headGeometry = new THREE.ConeGeometry(0.035, 0.1, 6);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.3 });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.rotation.z = -Math.PI / 2;
  head.position.x = 0.3;
  arrowGroup.add(head);

  // Fletching
  const fletchGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.008);
  const fletchMaterial = new THREE.MeshStandardMaterial({ color: teamColor, emissive: teamColor, emissiveIntensity: 0.3 });
  const fletch1 = new THREE.Mesh(fletchGeometry, fletchMaterial);
  fletch1.position.set(-0.2, 0, 0);
  arrowGroup.add(fletch1);
  const fletch2 = new THREE.Mesh(fletchGeometry, fletchMaterial);
  fletch2.position.set(-0.2, 0, 0);
  fletch2.rotation.x = Math.PI / 2;
  arrowGroup.add(fletch2);

  // Trail effect
  const trailGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.02);
  const trailMaterial = new THREE.MeshBasicMaterial({ color: teamColor, transparent: true, opacity: 0.4 });
  const trail = new THREE.Mesh(trailGeometry, trailMaterial);
  trail.position.x = -0.35;
  arrowGroup.add(trail);

  return arrowGroup;
}

// Create fancy fat cat with top hat and cane
function createFancyCat(color, x, z) {
  const catGroup = new THREE.Group();

  // Fat round body
  const bodyGeometry = new THREE.SphereGeometry(0.4, 16, 16);
  bodyGeometry.scale(1, 1.1, 0.9);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.1, roughness: 0.8 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.4;
  catGroup.add(body);

  // Fancy vest/jacket
  const jacketGeometry = new THREE.SphereGeometry(0.42, 16, 16);
  jacketGeometry.scale(0.95, 0.7, 0.85);
  const jacketMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a3a, metalness: 0.3, roughness: 0.6 });
  const jacket = new THREE.Mesh(jacketGeometry, jacketMaterial);
  jacket.position.y = 0.35;
  catGroup.add(jacket);

  // Gold buttons on jacket
  const buttonGeometry = new THREE.SphereGeometry(0.03, 8, 8);
  const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
  for (let i = 0; i < 3; i++) {
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.position.set(0.38, 0.25 + i * 0.12, 0);
    catGroup.add(button);
  }

  // Round head
  const headGeometry = new THREE.SphereGeometry(0.28, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.1, roughness: 0.8 });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, 0.85, 0);
  catGroup.add(head);

  // Pointy ears
  const earGeometry = new THREE.ConeGeometry(0.08, 0.15, 4);
  const earMaterial = new THREE.MeshStandardMaterial({ color });
  const leftEar = new THREE.Mesh(earGeometry, earMaterial);
  leftEar.position.set(0, 1.1, 0.15);
  leftEar.rotation.x = -0.2;
  catGroup.add(leftEar);
  const rightEar = new THREE.Mesh(earGeometry, earMaterial);
  rightEar.position.set(0, 1.1, -0.15);
  rightEar.rotation.x = 0.2;
  catGroup.add(rightEar);

  // Inner ears (pink)
  const innerEarGeometry = new THREE.ConeGeometry(0.04, 0.08, 4);
  const innerEarMaterial = new THREE.MeshStandardMaterial({ color: 0xffb6c1 });
  const leftInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
  leftInnerEar.position.set(0, 1.08, 0.15);
  leftInnerEar.rotation.x = -0.2;
  catGroup.add(leftInnerEar);
  const rightInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
  rightInnerEar.position.set(0, 1.08, -0.15);
  rightInnerEar.rotation.x = 0.2;
  catGroup.add(rightInnerEar);

  // === TOP HAT ===
  const hatGroup = new THREE.Group();

  // Hat brim
  const brimGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.03, 16);
  const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.7 });
  const brim = new THREE.Mesh(brimGeometry, hatMaterial);
  hatGroup.add(brim);

  // Hat top
  const topGeometry = new THREE.CylinderGeometry(0.18, 0.2, 0.35, 16);
  const top = new THREE.Mesh(topGeometry, hatMaterial);
  top.position.y = 0.19;
  hatGroup.add(top);

  // Hat band (gold)
  const bandGeometry = new THREE.CylinderGeometry(0.201, 0.201, 0.05, 16);
  const bandMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.7, roughness: 0.3 });
  const band = new THREE.Mesh(bandGeometry, bandMaterial);
  band.position.y = 0.05;
  hatGroup.add(band);

  hatGroup.position.set(0, 1.15, 0);
  catGroup.add(hatGroup);

  // Smug face - eyes
  const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x90EE90 }); // Light green cat eyes
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(0.2, 0.9, 0.12);
  catGroup.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.2, 0.9, -0.12);
  catGroup.add(rightEye);

  // Pupils (vertical slits)
  const pupilGeometry = new THREE.BoxGeometry(0.02, 0.06, 0.01);
  const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  leftPupil.position.set(0.25, 0.9, 0.12);
  catGroup.add(leftPupil);
  const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  rightPupil.position.set(0.25, 0.9, -0.12);
  catGroup.add(rightPupil);

  // Smug smile
  const smileGeometry = new THREE.TorusGeometry(0.08, 0.015, 8, 12, Math.PI);
  const smileMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const smile = new THREE.Mesh(smileGeometry, smileMaterial);
  smile.position.set(0.25, 0.75, 0);
  smile.rotation.x = Math.PI;
  smile.rotation.y = Math.PI / 2;
  catGroup.add(smile);

  // Whiskers
  const whiskerMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const whiskerPositions = [
    [[0.25, 0.8, 0.1], [0.4, 0.82, 0.25]],
    [[0.25, 0.78, 0.1], [0.4, 0.78, 0.28]],
    [[0.25, 0.76, 0.1], [0.4, 0.74, 0.25]],
    [[0.25, 0.8, -0.1], [0.4, 0.82, -0.25]],
    [[0.25, 0.78, -0.1], [0.4, 0.78, -0.28]],
    [[0.25, 0.76, -0.1], [0.4, 0.74, -0.25]],
  ];
  whiskerPositions.forEach(([start, end]) => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    const whiskerGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const whisker = new THREE.Line(whiskerGeometry, whiskerMaterial);
    catGroup.add(whisker);
  });

  // Pink nose
  const noseGeometry = new THREE.SphereGeometry(0.04, 8, 8);
  noseGeometry.scale(1, 0.7, 0.8);
  const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xffb6c1 });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(0.27, 0.82, 0);
  catGroup.add(nose);

  // Stubby legs
  const legGeometry = new THREE.CylinderGeometry(0.07, 0.08, 0.15, 8);
  const legMaterial = new THREE.MeshStandardMaterial({ color });
  [[0.15, 0.08, 0.2], [0.15, 0.08, -0.2], [-0.15, 0.08, 0.2], [-0.15, 0.08, -0.2]].forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(...pos);
    catGroup.add(leg);
  });

  // Fancy tail (curled up)
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.3, 0),
    new THREE.Vector3(-0.5, 0.4, 0),
    new THREE.Vector3(-0.55, 0.6, 0),
    new THREE.Vector3(-0.45, 0.75, 0),
    new THREE.Vector3(-0.35, 0.8, 0),
  ]);
  const tailGeometry = new THREE.TubeGeometry(tailCurve, 12, 0.04, 8, false);
  const tailMaterial = new THREE.MeshStandardMaterial({ color });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  catGroup.add(tail);

  // === CANE ===
  const caneGroup = new THREE.Group();

  // Cane shaft
  const shaftGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8);
  const caneMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.4, roughness: 0.6 });
  const shaft = new THREE.Mesh(shaftGeometry, caneMaterial);
  shaft.position.y = 0.35;
  caneGroup.add(shaft);

  // Cane handle (gold curved top)
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.7, 0),
    new THREE.Vector3(0.05, 0.75, 0),
    new THREE.Vector3(0.12, 0.73, 0),
    new THREE.Vector3(0.15, 0.68, 0),
  ]);
  const handleGeometry = new THREE.TubeGeometry(handleCurve, 8, 0.03, 8, false);
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  caneGroup.add(handle);

  // Cane tip (gold)
  const tipGeometry = new THREE.SphereGeometry(0.035, 8, 8);
  const tip = new THREE.Mesh(tipGeometry, handleMaterial);
  tip.position.y = 0;
  caneGroup.add(tip);

  caneGroup.position.set(0.45, 0, 0.25);
  caneGroup.rotation.z = 0.2;
  catGroup.add(caneGroup);

  // Monocle on right eye
  const monocleGeometry = new THREE.TorusGeometry(0.06, 0.008, 8, 16);
  const monocleMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
  const monocle = new THREE.Mesh(monocleGeometry, monocleMaterial);
  monocle.position.set(0.26, 0.9, -0.12);
  monocle.rotation.y = Math.PI / 2;
  catGroup.add(monocle);

  // Monocle chain
  const chainPoints = [
    new THREE.Vector3(0.26, 0.84, -0.12),
    new THREE.Vector3(0.2, 0.7, -0.1),
    new THREE.Vector3(0.15, 0.5, -0.05),
  ];
  const chainGeometry = new THREE.BufferGeometry().setFromPoints(chainPoints);
  const chainMaterial = new THREE.LineBasicMaterial({ color: 0xffd700 });
  const chain = new THREE.Line(chainGeometry, chainMaterial);
  catGroup.add(chain);

  // Bow tie
  const bowTieGroup = new THREE.Group();
  const bowGeometry = new THREE.BoxGeometry(0.12, 0.06, 0.03);
  const bowMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
  const leftBow = new THREE.Mesh(bowGeometry, bowMaterial);
  leftBow.position.z = 0.05;
  leftBow.rotation.y = 0.3;
  bowTieGroup.add(leftBow);
  const rightBow = new THREE.Mesh(bowGeometry, bowMaterial);
  rightBow.position.z = -0.05;
  rightBow.rotation.y = -0.3;
  bowTieGroup.add(rightBow);
  const knotGeometry = new THREE.SphereGeometry(0.03, 8, 8);
  const knot = new THREE.Mesh(knotGeometry, bowMaterial);
  bowTieGroup.add(knot);
  bowTieGroup.position.set(0.35, 0.6, 0);
  catGroup.add(bowTieGroup);

  catGroup.position.set(x, 0, z);

  return catGroup;
}

// Create 3D bar for chart
function createBar(height, color, x) {
  const barGroup = new THREE.Group();

  const geometry = new THREE.BoxGeometry(0.5, height, 0.5);
  const material = new THREE.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.5 });
  const bar = new THREE.Mesh(geometry, material);
  bar.position.y = height / 2;
  barGroup.add(bar);

  const glowGeometry = new THREE.BoxGeometry(0.55, height + 0.05, 0.55);
  const glowMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15 });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.y = height / 2;
  barGroup.add(glow);

  barGroup.position.x = x;
  return barGroup;
}

// Create projection chart
function createProjectionChart(currentSavings, monthlySavings, savingsGoal, months) {
  const chartGroup = new THREE.Group();

  const platformGeometry = new THREE.BoxGeometry(7, 0.08, 2.5);
  const platformMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a40, metalness: 0.2, roughness: 0.8 });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = 0.04;
  chartGroup.add(platform);

  const gridMaterial = new THREE.LineBasicMaterial({ color: 0x3b3b5c, transparent: true, opacity: 0.5 });
  for (let i = 0; i <= 4; i++) {
    const points = [new THREE.Vector3(-3, 0.09, -1 + i * 0.5), new THREE.Vector3(3, 0.09, -1 + i * 0.5)];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    chartGroup.add(new THREE.Line(lineGeometry, gridMaterial));
  }

  const maxMonths = Math.min(months, 12);
  const barWidth = 5.5 / (maxMonths + 1);

  for (let i = 0; i <= maxMonths; i++) {
    const projectedSavings = currentSavings + (monthlySavings * i);
    const progress = savingsGoal > 0 ? Math.min(projectedSavings / savingsGoal, 1) : 0;
    const barHeight = progress * 2 + 0.1;
    const isCurrentMonth = i === 0;
    const isGoalReached = projectedSavings >= savingsGoal;
    const barColor = isCurrentMonth ? 0x6366f1 : isGoalReached ? 0x10b981 : 0x3b82f6;

    const barGeometry = new THREE.BoxGeometry(barWidth * 0.7, barHeight, 0.35);
    const barMaterial = new THREE.MeshStandardMaterial({
      color: barColor, metalness: 0.4, roughness: 0.4, emissive: barColor, emissiveIntensity: isGoalReached ? 0.3 : 0.1
    });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(-2.5 + i * (5.5 / maxMonths), barHeight / 2 + 0.08, 0);
    chartGroup.add(bar);
  }

  const goalLineGeometry = new THREE.BoxGeometry(6, 0.02, 0.02);
  const goalLineMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.5 });
  const goalLine = new THREE.Mesh(goalLineGeometry, goalLineMaterial);
  goalLine.position.set(0, 2.1, 0);
  chartGroup.add(goalLine);

  const flagPoleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
  const flagPole = new THREE.Mesh(flagPoleGeometry, new THREE.MeshStandardMaterial({ color: 0xffd700 }));
  flagPole.position.set(3, 2.4, 0);
  chartGroup.add(flagPole);

  const flagGeometry = new THREE.BoxGeometry(0.35, 0.2, 0.015);
  const flag = new THREE.Mesh(flagGeometry, new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.3 }));
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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f18);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 10, 18);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 15, 10);
    scene.add(directionalLight);

    const redLight = new THREE.PointLight(0xff4444, 0.5, 30);
    redLight.position.set(-10, 5, 5);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x4444ff, 0.5, 30);
    blueLight.position.set(10, 5, 5);
    scene.add(blueLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(40, 40);
    const ground = new THREE.Mesh(groundGeometry, new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.9 }));
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

    // Expense bars
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

    if (data.income) {
      const incomeHeight = (data.income / maxExpense) * 2.5 + 0.15;
      const incomeBar = createBar(Math.min(incomeHeight, 3.5), 0x10b981, startX - barSpacing * 1.5);
      incomeBar.position.z = 6;
      scene.add(incomeBar);
      expenseBars.push(incomeBar);
    }

    // Projection chart
    const projectionChart = createProjectionChart(currentSavings, monthlySavings, savingsGoal, monthsToGoal);
    projectionChart.position.set(0, 0, -5);
    scene.add(projectionChart);

    // === ARMIES ===
    const dogColors = [0xc4a574, 0x8b6914, 0xf5f5dc, 0x4a4a4a, 0xd4956a, 0xa0522d, 0xdeb887, 0x8b4513, 0xf4a460, 0xcd853f];
    const teamRed = 0x8b0000;
    const teamBlue = 0x00008b;

    const dogs = [];
    const archers = [];
    const arrows = [];

    // Red Army - Front row warriors (5), Back row archers (5)
    for (let i = 0; i < 10; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const x = -8 - row * 1.5;
      const z = -2 + col * 1.5;
      const isArcher = row === 1;

      const dog = isArcher
        ? createArcherDog(dogColors[i % dogColors.length], teamRed, x, z, false)
        : createWarriorDog(dogColors[i % dogColors.length], teamRed, x, z, false);

      dog.userData = {
        team: 'red',
        isArcher,
        baseX: x,
        baseZ: z,
        state: 'idle',
        stateTimer: 1 + Math.random() * 2,
        speed: isArcher ? 0.02 : 0.04 + Math.random() * 0.02,
        swingOffset: Math.random() * Math.PI * 2,
        row,
        shootTimer: 2 + Math.random() * 3,
      };
      scene.add(dog);
      dogs.push(dog);
      if (isArcher) archers.push(dog);
    }

    // Blue Army - Front row warriors (5), Back row archers (5)
    for (let i = 0; i < 10; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const x = 8 + row * 1.5;
      const z = -2 + col * 1.5;
      const isArcher = row === 1;

      const dog = isArcher
        ? createArcherDog(dogColors[(i + 5) % dogColors.length], teamBlue, x, z, true)
        : createWarriorDog(dogColors[(i + 5) % dogColors.length], teamBlue, x, z, true);

      dog.userData = {
        team: 'blue',
        isArcher,
        baseX: x,
        baseZ: z,
        state: 'idle',
        stateTimer: 1.5 + Math.random() * 2,
        speed: isArcher ? 0.02 : 0.04 + Math.random() * 0.02,
        swingOffset: Math.random() * Math.PI * 2,
        row,
        shootTimer: 2.5 + Math.random() * 3,
      };
      scene.add(dog);
      dogs.push(dog);
      if (isArcher) archers.push(dog);
    }

    // === FANCY FAT CATS - Spectators cheering in front ===
    const catColors = [0x808080, 0xffa500, 0x2f2f2f, 0xf5f5dc, 0xd2691e];
    const fancyCats = [];

    for (let i = 0; i < 5; i++) {
      const x = -4 + i * 2;
      const z = 8.5;
      const cat = createFancyCat(catColors[i % catColors.length], x, z);
      cat.rotation.y = Math.PI; // Face the battle
      cat.userData = {
        baseY: 0,
        danceOffset: Math.random() * Math.PI * 2,
        danceSpeed: 2 + Math.random(),
        caneOffset: Math.random() * Math.PI * 2,
        cheerTimer: Math.random() * 2,
      };
      scene.add(cat);
      fancyCats.push(cat);
    }

    // Spawn arrow function
    function spawnArrow(archer) {
      const teamColor = archer.userData.team === 'red' ? 0xff4444 : 0x4444ff;
      const arrow = createArrow(teamColor);
      const direction = archer.userData.team === 'red' ? 1 : -1;

      arrow.position.copy(archer.position);
      arrow.position.y = 0.5;
      arrow.position.x += direction * 0.5;

      arrow.rotation.y = archer.userData.team === 'red' ? 0 : Math.PI;

      arrow.userData = {
        team: archer.userData.team,
        speed: 0.25 + Math.random() * 0.1,
        direction,
        life: 0,
        maxLife: 80,
        startY: 0.5,
        arcHeight: 1.5 + Math.random() * 0.5,
      };

      scene.add(arrow);
      arrows.push(arrow);
    }

    // Animation
    let animationId;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.016;

      // Animate expense bars
      expenseBars.forEach((bar, index) => {
        bar.scale.y = 1 + Math.sin(time * 2 + index) * 0.02;
      });

      // Dog animations
      dogs.forEach((dog, index) => {
        const ud = dog.userData;
        ud.stateTimer -= 0.016;

        const bounce = Math.sin(time * 6 + index * 0.5) * 0.02;

        if (ud.isArcher) {
          // Archer behavior - stay back and shoot
          dog.position.y = bounce;
          dog.rotation.z = Math.sin(time * 2 + index) * 0.03;

          // Shooting animation
          ud.shootTimer -= 0.016;
          if (ud.shootTimer <= 0) {
            // Draw bow animation
            const bow = dog.children.find(c => c.children && c.children.some(cc => cc.geometry?.type === 'TorusGeometry'));
            if (bow) {
              bow.rotation.z = Math.sin(time * 8) * 0.2;
            }

            if (ud.shootTimer <= -0.5) {
              spawnArrow(dog);
              ud.shootTimer = 3 + Math.random() * 2;
            }
          }
        } else {
          // Warrior behavior
          if (ud.state === 'idle') {
            dog.position.y = bounce;
            dog.rotation.z = Math.sin(time * 2 + index) * 0.05;
            if (ud.stateTimer <= 0) {
              ud.state = 'charging';
              ud.stateTimer = 3 + Math.random() * 2;
            }
          }

          if (ud.state === 'charging') {
            const targetX = ud.team === 'red' ? 1.5 : -1.5;
            const dx = targetX - dog.position.x;
            const dist = Math.abs(dx);

            if (dist > 0.5) {
              dog.position.x += Math.sign(dx) * ud.speed;
              dog.position.y = Math.abs(Math.sin(time * 15 + index)) * 0.08;
              dog.rotation.z = Math.sin(time * 12 + index) * 0.1;

              const sword = dog.children.find(c => c.children?.length === 4);
              if (sword) sword.rotation.z = -0.8 + Math.sin(time * 10) * 0.2;
            } else {
              ud.state = 'fighting';
              ud.stateTimer = 2 + Math.random() * 1.5;
            }
          }

          if (ud.state === 'fighting') {
            dog.position.y = Math.abs(Math.sin(time * 10 + index)) * 0.05;
            dog.position.x += Math.sin(time * 8 + index * 2) * 0.015;
            dog.rotation.z = Math.sin(time * 15 + index) * 0.12;

            const sword = dog.children.find(c => c.children?.length === 4);
            if (sword) {
              sword.rotation.z = -0.5 + Math.sin(time * 12 + ud.swingOffset) * 0.6;
              sword.rotation.x = 0.2 + Math.sin(time * 10 + ud.swingOffset) * 0.3;
            }

            const shield = dog.children.find(c => c.children?.length === 3);
            if (shield) shield.rotation.y = -0.5 + Math.sin(time * 8 + ud.swingOffset + 1) * 0.3;

            if (ud.stateTimer <= 0) {
              ud.state = 'retreating';
              ud.stateTimer = 2 + Math.random() * 2;
            }
          }

          if (ud.state === 'retreating') {
            const dx = ud.baseX - dog.position.x;
            if (Math.abs(dx) > 0.3) {
              dog.position.x += Math.sign(dx) * ud.speed * 0.6;
              dog.position.y = Math.abs(Math.sin(time * 12 + index)) * 0.06;
            } else {
              ud.state = 'idle';
              ud.stateTimer = 1 + Math.random() * 2;
            }
          }
        }

        // Tail wag
        const tail = dog.children.find(c => c.geometry?.type === 'SphereGeometry' && c.position.x < -0.4);
        if (tail) {
          const wagSpeed = ud.state === 'fighting' ? 18 : 8;
          tail.position.z = Math.sin(time * wagSpeed + index) * 0.06;
        }
      });

      // Animate arrows
      for (let i = arrows.length - 1; i >= 0; i--) {
        const arrow = arrows[i];
        const ud = arrow.userData;

        ud.life++;
        const progress = ud.life / ud.maxLife;

        // Move forward
        arrow.position.x += ud.speed * ud.direction;

        // Arc trajectory
        const arcProgress = Math.sin(progress * Math.PI);
        arrow.position.y = ud.startY + arcProgress * ud.arcHeight;

        // Tilt based on arc
        const tiltAngle = Math.cos(progress * Math.PI) * 0.3;
        arrow.rotation.z = ud.direction === 1 ? -tiltAngle : tiltAngle + Math.PI;

        // Remove old arrows
        if (ud.life >= ud.maxLife) {
          scene.remove(arrow);
          arrows.splice(i, 1);
        }
      }

      // Animate fancy cats - dancing and cheering
      fancyCats.forEach((cat, index) => {
        const ud = cat.userData;

        // Bouncy dance
        const bounce = Math.abs(Math.sin(time * ud.danceSpeed + ud.danceOffset)) * 0.15;
        cat.position.y = ud.baseY + bounce;

        // Side-to-side sway
        cat.rotation.z = Math.sin(time * 1.5 + ud.danceOffset) * 0.1;

        // Slight forward/back lean
        cat.rotation.x = Math.sin(time * 2 + ud.danceOffset + 1) * 0.05;

        // Find and animate the cane (twirl it)
        const cane = cat.children.find(c => c.children && c.position.x > 0.4 && c.position.z > 0.2);
        if (cane) {
          cane.rotation.z = 0.2 + Math.sin(time * 3 + ud.caneOffset) * 0.3;
          // Occasionally lift the cane high
          if (Math.sin(time * 1.5 + ud.caneOffset) > 0.8) {
            cane.rotation.z = -0.5;
            cane.position.y = 0.2;
          } else {
            cane.position.y = 0;
          }
        }

        // Find and animate the top hat (tip it)
        const hat = cat.children.find(c => c.children && c.position.y > 1);
        if (hat) {
          hat.rotation.z = Math.sin(time * 2 + ud.danceOffset) * 0.15;
          // Occasionally tip the hat
          if (Math.sin(time + ud.danceOffset * 2) > 0.9) {
            hat.position.y = 1.2;
            hat.rotation.x = 0.3;
          } else {
            hat.position.y = 1.15;
            hat.rotation.x = 0;
          }
        }
      });

      // Animate flag
      const flag = projectionChart.children.find(c => c.geometry?.type === 'BoxGeometry' && c.position.y > 2.5);
      if (flag) flag.rotation.z = Math.sin(time * 4) * 0.1;

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
          if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
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
            <Text fontSize="sm" color="gray.500">Warriors, Archers & Fat Cat Spectators</Text>
          </VStack>
          {monthsToGoal !== null && monthsToGoal !== Infinity && (
            <Badge colorScheme={monthsToGoal <= 6 ? "green" : monthsToGoal <= 12 ? "blue" : "purple"} fontSize="sm" px="3" py="1" borderRadius="full">
              {monthsToGoal} {monthsToGoal === 1 ? "month" : "months"} to victory
            </Badge>
          )}
        </HStack>

        {savingsGoal > 0 && (
          <Box>
            <HStack justify="space-between" mb="1">
              <Text fontSize="sm" color="gray.400">Progress to ${savingsGoal.toLocaleString()} goal</Text>
              <Text fontSize="sm" color="green.400" fontWeight="bold">{progressPercent.toFixed(1)}%</Text>
            </HStack>
            <ProgressRoot value={progressPercent} size="sm" borderRadius="full">
              <ProgressTrack bg="gray.700"><ProgressRange bg="green.500" /></ProgressTrack>
            </ProgressRoot>
          </Box>
        )}

        <Box ref={containerRef} borderRadius="md" overflow="hidden" minH="500px" />

        <HStack justify="space-between" flexWrap="wrap" gap="4" pt="2">
          <VStack align="start" gap="1">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase">Monthly Income</Text>
            <Text color="green.400" fontSize="lg" fontWeight="bold">${(data.income || 0).toLocaleString()}</Text>
          </VStack>
          <VStack align="start" gap="1">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase">Total Expenses</Text>
            <Text color="red.400" fontSize="lg" fontWeight="bold">${totalExpenses.toLocaleString()}</Text>
          </VStack>
          <VStack align="start" gap="1">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase">Monthly Savings</Text>
            <Text color={monthlySavings >= 0 ? "blue.400" : "red.400"} fontSize="lg" fontWeight="bold">${monthlySavings.toLocaleString()}</Text>
          </VStack>
          {savingsGoal > 0 && (
            <VStack align="start" gap="1">
              <Text color="gray.500" fontSize="xs" textTransform="uppercase">Remaining to Goal</Text>
              <Text color="purple.400" fontSize="lg" fontWeight="bold">${remainingToGoal.toLocaleString()}</Text>
            </VStack>
          )}
        </HStack>

        {monthsToGoal !== null && monthsToGoal !== Infinity && savingsGoal > 0 && (
          <Box p="4" bg="gray.800" borderRadius="md" borderWidth="1px" borderColor="gray.700">
            <HStack gap="3" align="start">
              <Text fontSize="2xl">⚔️🏹</Text>
              <VStack align="start" gap="1">
                <Text fontWeight="bold" color="white">Monthly Projection</Text>
                <Text fontSize="sm" color="gray.400">
                  At ${monthlySavings.toLocaleString()}/month, you'll reach your ${savingsGoal.toLocaleString()} goal in{" "}
                  <Text as="span" color="green.400" fontWeight="bold">{monthsToGoal} {monthsToGoal === 1 ? "month" : "months"}</Text>
                </Text>
                <HStack gap="4" pt="2" fontSize="xs" color="gray.500">
                  <HStack gap="1"><Box w="3" h="3" bg="indigo.500" borderRadius="sm" /><Text>Current</Text></HStack>
                  <HStack gap="1"><Box w="3" h="3" bg="blue.500" borderRadius="sm" /><Text>Projected</Text></HStack>
                  <HStack gap="1"><Box w="3" h="3" bg="green.500" borderRadius="sm" /><Text>Goal Reached</Text></HStack>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        )}

        {data.expenses && data.expenses.length > 0 && (
          <Box pt="2">
            <Text color="gray.500" fontSize="xs" textTransform="uppercase" mb="2">Expense Categories (Enemy Forces)</Text>
            <HStack flexWrap="wrap" gap="2">
              {data.expenses.map((expense, index) => (
                <Badge key={index} variant="subtle" colorScheme={["red", "yellow", "purple", "cyan", "pink", "blue"][index % 6]} px="3" py="1" borderRadius="full">
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
