import * as THREE from "three";
import { Body, Box, ContactMaterial, Material, Plane, Vec3, World } from "cannon-es";
import { random } from "es-toolkit";
import { createDragControls } from "./drag-digits.ts";

function digitGeometry(digit: "4" | "0") {
  const shape = new THREE.Shape();
  if (digit === "4") {
    const points = [
      [-0.75, 1.2],
      [-0.25, 1.2],
      [-0.25, 0],
      [0.25, 0],
      [0.25, 1.2],
      [0.75, 1.2],
      [0.75, -1.2],
      [0.25, -1.2],
      [0.25, -0.5],
      [-0.75, -0.5],
    ];
    points.forEach(([x, y], index) => (index === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
    shape.closePath();
  } else {
    shape.moveTo(-0.35, -1.2);
    shape.lineTo(0.35, -1.2);
    shape.quadraticCurveTo(0.8, -1.2, 0.8, -0.75);
    shape.lineTo(0.8, 0.75);
    shape.quadraticCurveTo(0.8, 1.2, 0.35, 1.2);
    shape.lineTo(-0.35, 1.2);
    shape.quadraticCurveTo(-0.8, 1.2, -0.8, 0.75);
    shape.lineTo(-0.8, -0.75);
    shape.quadraticCurveTo(-0.8, -1.2, -0.35, -1.2);
    const hole = new THREE.Path();
    hole.moveTo(-0.3, -0.7);
    hole.lineTo(-0.3, 0.7);
    hole.quadraticCurveTo(0, 0.95, 0.3, 0.7);
    hole.lineTo(0.3, -0.7);
    hole.quadraticCurveTo(0, -0.95, -0.3, -0.7);
    shape.holes.push(hole);
  }
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.4,
    bevelEnabled: true,
    bevelSize: 0.06,
    bevelThickness: 0.06,
    bevelSegments: 3,
    steps: 1,
    curveSegments: 12,
  });
  geometry.translate(0, 0, -0.2);
  return geometry;
}

function cssColor(value: string) {
  const context = document.createElement("canvas").getContext("2d")!;
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
  return new THREE.Color().setRGB(red / 255, green / 255, blue / 255, THREE.SRGBColorSpace);
}

export function createScene(container: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.className = "block size-full select-none";
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 11, 13);
  camera.lookAt(0, 0.8, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x71717a, 2));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-3, 9, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7 });
  light.shadow.normalBias = 0.03;
  scene.add(light);

  const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.18 });
  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const world = new World({ gravity: new Vec3(0, -18, 0), allowSleep: true });
  const surface = new Material("surface");
  world.addContactMaterial(
    new ContactMaterial(surface, surface, { friction: 0.6, restitution: 0.22 }),
  );
  const ground = new Body({ mass: 0, material: surface, shape: new Plane() });
  ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(ground);
  for (const [x, z, width, depth] of [
    [-5.5, 0, 0.25, 3.5],
    [5.5, 0, 0.25, 3.5],
    [0, -3.5, 5.5, 0.25],
    [0, 3.5, 5.5, 0.25],
  ]) {
    const wall = new Body({
      mass: 0,
      material: surface,
      shape: new Box(new Vec3(width, 10, depth)),
      position: new Vec3(x, 10, z),
    });
    world.addBody(wall);
  }

  const digits = (["4", "0", "4"] as const).map((digit) => {
    const geometry = digitGeometry(digit);
    const digitMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.45,
      metalness: 0.1,
      emissiveIntensity: 0,
    });
    const mesh = new THREE.Mesh(geometry, digitMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    const body = new Body({
      mass: 2,
      material: surface,
      angularDamping: 0.35,
      linearDamping: 0.15,
      sleepSpeedLimit: 0.15,
      sleepTimeLimit: 1,
    });
    const bars =
      digit === "4"
        ? [
            [-0.5, 0.6, 0.25, 0.6],
            [0, -0.25, 0.75, 0.25],
            [0.5, 0, 0.25, 1.2],
          ]
        : [
            [-0.55, 0, 0.25, 0.8],
            [0.55, 0, 0.25, 0.8],
            [0, 0.95, 0.6, 0.25],
            [0, -0.95, 0.6, 0.25],
          ];
    for (const [x, y, width, height] of bars) {
      body.addShape(new Box(new Vec3(width + 0.03, height + 0.03, 0.26)), new Vec3(x, y, 0));
    }
    world.addBody(body);
    return { mesh, body };
  });

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const theme = window.matchMedia("(prefers-color-scheme: dark)");
  let animation: { status: "idle" } | { status: "running"; frame: number } = { status: "idle" };
  let previousTime = 0;

  function stop() {
    if (animation.status === "running") cancelAnimationFrame(animation.frame);
    animation = { status: "idle" };
    previousTime = 0;
  }

  function wake() {
    if (animation.status === "running" || document.hidden) return;
    previousTime = 0;
    animation = { status: "running", frame: requestAnimationFrame(tick) };
  }

  function render() {
    for (const { mesh, body } of digits) {
      mesh.position.copy(body.position);
      mesh.quaternion.copy(body.quaternion);
    }
    renderer.render(scene, camera);
  }

  function tick(time: number) {
    world.step(1 / 60, previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60, 3);
    previousTime = time;
    render();
    if (dragControls.dragging || digits.some(({ body }) => body.sleepState !== Body.SLEEPING)) {
      animation = { status: "running", frame: requestAnimationFrame(tick) };
    } else {
      animation = { status: "idle" };
    }
  }

  function settle() {
    stop();
    for (let step = 0; step < 600; step++) world.step(1 / 60);
    render();
  }

  const dragControls = createDragControls(renderer.domElement, camera, world, digits, {
    render,
    wake,
    release: () => (motion.matches ? settle() : wake()),
    reducedMotion: () => motion.matches,
  });

  function replay() {
    dragControls.cancel();
    stop();
    digits.forEach(({ body }, index) => {
      body.position.set(
        (index - 1) * 2.7 + random(-0.15, 0.15),
        7 + index * 2.8,
        random(-0.25, 0.25),
      );
      body.quaternion.setFromEuler(-0.3, random(-0.2, 0.2), random(-0.2, 0.2));
      body.velocity.set(0, 0, 0);
      body.angularVelocity.set(-random(1.2, 2.2), random(-0.3, 0.3), random(-0.3, 0.3));
      body.wakeUp();
    });
    if (motion.matches) {
      settle();
    } else {
      wake();
    }
  }

  function resize() {
    dragControls.cancel();
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = THREE.MathUtils.radToDeg(
      2 * Math.atan(5 / (camera.position.length() * Math.min(camera.aspect, 2))),
    );
    camera.updateProjectionMatrix();
    render();
  }

  function updateTheme() {
    const style = getComputedStyle(container);
    floorMaterial.opacity = theme.matches ? 0.35 : 0.18;
    const color = cssColor(style.color);
    for (const { mesh } of digits) {
      mesh.material.color.copy(color);
      mesh.material.emissive.copy(color);
    }
    render();
  }

  function visibilityChanged() {
    dragControls.cancel();
    stop();
    if (!document.hidden && !motion.matches) wake();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  theme.addEventListener("change", updateTheme);
  motion.addEventListener("change", replay);
  document.addEventListener("visibilitychange", visibilityChanged);
  updateTheme();
  resize();
  replay();

  return {
    dispose() {
      dragControls.dispose();
      stop();
      observer.disconnect();
      theme.removeEventListener("change", updateTheme);
      motion.removeEventListener("change", replay);
      document.removeEventListener("visibilitychange", visibilityChanged);
      digits.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      floorGeometry.dispose();
      floorMaterial.dispose();
      light.shadow.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
