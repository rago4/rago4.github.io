import * as THREE from "three";
import { Body, PointToPointConstraint, Vec3 } from "cannon-es";
import type { World } from "cannon-es";

type Digit = {
  mesh: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshStandardMaterial>;
  body: Body;
};

type Interaction =
  | { status: "idle" }
  | {
      status: "dragging";
      pointerId: number;
      digit: Digit;
      constraint: PointToPointConstraint;
      plane: THREE.Plane;
      lastPosition: THREE.Vector3;
      lastTime: number;
      velocity: THREE.Vector3;
    };

export function createDragControls(
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
  world: World,
  digits: Digit[],
  callbacks: {
    render: () => void;
    wake: () => void;
    release: () => void;
    reducedMotion: () => boolean;
  },
) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const anchor = new Body({
    type: Body.KINEMATIC,
    collisionFilterGroup: 0,
    collisionFilterMask: 0,
  });
  world.addBody(anchor);
  let interaction: Interaction = { status: "idle" };

  function pointRay(clientX: number, clientY: number) {
    const bounds = canvas.getBoundingClientRect();
    pointer.set(
      ((clientX - bounds.left) / bounds.width) * 2 - 1,
      (-(clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
  }

  function hit(clientX: number, clientY: number) {
    pointRay(clientX, clientY);
    return raycaster.intersectObjects(
      digits.map(({ mesh }) => mesh),
      false,
    )[0];
  }

  function highlight(selected?: Digit) {
    for (const digit of digits) {
      digit.mesh.material.emissive.copy(digit.mesh.material.color);
      digit.mesh.material.emissiveIntensity = digit === selected ? 0.15 : 0;
    }
    canvas.classList.toggle("cursor-grab", !!selected && interaction.status === "idle");
    canvas.classList.toggle("cursor-grabbing", interaction.status === "dragging");
    callbacks.render();
  }

  function release(throwDigit = false) {
    if (interaction.status === "idle") return;
    const drag = interaction;
    interaction = { status: "idle" };
    world.removeConstraint(drag.constraint);
    drag.digit.body.velocity.set(0, 0, 0);
    drag.digit.body.angularVelocity.set(0, 0, 0);
    if (throwDigit && !callbacks.reducedMotion() && performance.now() - drag.lastTime < 120) {
      drag.digit.body.velocity.set(drag.velocity.x, drag.velocity.y, drag.velocity.z);
    }
    drag.digit.body.wakeUp();
    if (canvas.hasPointerCapture(drag.pointerId)) canvas.releasePointerCapture(drag.pointerId);
    highlight();
    callbacks.release();
  }

  function pointerDown(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0 || interaction.status === "dragging") return;
    const intersection = hit(event.clientX, event.clientY);
    if (!intersection) return;
    const digit = digits.find(({ mesh }) => mesh === intersection.object)!;
    const point = new Vec3(intersection.point.x, intersection.point.y, intersection.point.z);
    anchor.position.copy(point);
    const pivot = digit.body.pointToLocalFrame(point);
    const constraint = new PointToPointConstraint(digit.body, pivot, anchor, new Vec3(), 2500);
    constraint.collideConnected = false;
    world.addConstraint(constraint);
    digit.body.wakeUp();
    interaction = {
      status: "dragging",
      pointerId: event.pointerId,
      digit,
      constraint,
      plane: new THREE.Plane().setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(new THREE.Vector3()),
        intersection.point,
      ),
      lastPosition: intersection.point.clone(),
      lastTime: performance.now(),
      velocity: new THREE.Vector3(),
    };
    canvas.setPointerCapture(event.pointerId);
    event.preventDefault();
    highlight(digit);
    callbacks.wake();
  }

  function pointerMove(event: PointerEvent) {
    if (interaction.status === "idle") {
      if (event.pointerType === "touch") return;
      const intersection = hit(event.clientX, event.clientY);
      highlight(digits.find(({ mesh }) => mesh === intersection?.object));
      return;
    }
    if (event.pointerId !== interaction.pointerId) return;
    pointRay(event.clientX, event.clientY);
    const position = raycaster.ray.intersectPlane(interaction.plane, new THREE.Vector3());
    if (!position) return;
    position.clamp(new THREE.Vector3(-4, 0.3, -2), new THREE.Vector3(4, 6, 2));
    const now = performance.now();
    const elapsed = Math.max((now - interaction.lastTime) / 1000, 1 / 120);
    const velocity = position
      .clone()
      .sub(interaction.lastPosition)
      .divideScalar(elapsed)
      .clampLength(0, 12);
    interaction.velocity.lerp(velocity, 0.5);
    interaction.lastPosition.copy(position);
    interaction.lastTime = now;
    anchor.position.set(position.x, position.y, position.z);
    interaction.digit.body.wakeUp();
    callbacks.wake();
  }

  function pointerUp(event: PointerEvent) {
    if (interaction.status !== "dragging" || interaction.pointerId !== event.pointerId) return;
    release(event.type === "pointerup");
  }

  function pointerLeave() {
    if (interaction.status === "idle") highlight();
  }

  function cancel() {
    release();
  }

  function touchStart(event: TouchEvent) {
    const touch = event.changedTouches[0];
    if (interaction.status === "dragging" || (touch && hit(touch.clientX, touch.clientY)))
      event.preventDefault();
  }

  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointercancel", pointerUp);
  canvas.addEventListener("lostpointercapture", pointerUp);
  canvas.addEventListener("pointerleave", pointerLeave);
  canvas.addEventListener("touchstart", touchStart, { passive: false });
  window.addEventListener("blur", cancel);

  return {
    get dragging() {
      return interaction.status === "dragging";
    },
    cancel,
    dispose() {
      release();
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      canvas.removeEventListener("lostpointercapture", pointerUp);
      canvas.removeEventListener("pointerleave", pointerLeave);
      canvas.removeEventListener("touchstart", touchStart);
      window.removeEventListener("blur", cancel);
      world.removeBody(anchor);
    },
  };
}
