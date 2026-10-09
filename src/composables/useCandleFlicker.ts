import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { useSpring } from 'motion-v';
import { lightColor } from '../utils/lightColor';

function noiseLayer(minDuration: number, maxDuration: number) {
  let from = 0;
  let to = 0;
  let elapsed = 0;
  let duration = 0;
  return (delta: number) => {
    elapsed += delta;
    if (elapsed >= duration) {
      from = to;
      to = Math.random() * 2 - 1;
      elapsed = 0;
      duration = minDuration + Math.random() * (maxDuration - minDuration);
    }
    const progress = elapsed / duration;
    const smooth = progress * progress * (3 - 2 * progress);
    return from + (to - from) * smooth;
  };
}

export function useCandleFlicker(enabled: Ref<boolean>, kelvin: Ref<number>, brightness: Ref<number>) {
  const reducedMotion = ref(true);
  const visible = ref(false);
  const frameColor = ref<string>();
  const running = computed(() => enabled.value && visible.value && !reducedMotion.value);
  const intensitySpring = useSpring(1, {
    stiffness: 500, damping: 28, mass: 0.5, restDelta: 0.0001, restSpeed: 0.001,
  });
  const warmthSpring = useSpring(0, {
    stiffness: 90, damping: 18, mass: 1, restDelta: 0.05, restSpeed: 0.1,
  });
  let frame = 0;
  let lastTime = 0;
  let motionQuery: MediaQueryList | undefined;

  const stopWatching = watch(running, active => {
    cancelAnimationFrame(frame);
    intensitySpring.jump(1);
    warmthSpring.jump(0);
    frameColor.value = undefined;
    lastTime = 0;
    if (!active) return;

    const drift = noiseLayer(0.7, 2.4);
    const flutter = noiseLayer(0.09, 0.24);
    const tremor = noiseLayer(0.035, 0.08);
    let nextDisturbance = 1 + Math.random() * 3;
    let disturbanceAge = 10;
    let disturbanceDepth = 0;
    let recovery = 1;

    function animate(time: number) {
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      nextDisturbance -= delta;
      if (nextDisturbance <= 0) {
        disturbanceAge = 0;
        disturbanceDepth = 0.045 + Math.random() * 0.065;
        recovery = 0.22 + Math.random() * 0.5;
        nextDisturbance = 2 + Math.random() * 5;
      }
      disturbanceAge += delta;
      const dip = disturbanceDepth * (1 - Math.exp(-disturbanceAge / 0.045))
        * Math.exp(-disturbanceAge / recovery);
      const flare = disturbanceDepth * 0.22
        * Math.exp(-(((disturbanceAge - recovery * 1.5) / 0.22) ** 2));
      const target = 1 + drift(delta) * 0.035 + flutter(delta) * 0.028 - dip + flare;
      intensitySpring.set(target);
      warmthSpring.set((target - 1) * 650);
      const gain = Math.min(1.08, Math.max(0.85, intensitySpring.get() + tremor(delta) * 0.006));
      const intensity = Math.min(100, brightness.value * gain);
      frameColor.value = lightColor(kelvin.value + warmthSpring.get(), intensity);
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
  }, { flush: 'sync' });

  function syncVisibility() { visible.value = !document.hidden; }
  function syncMotion() { reducedMotion.value = motionQuery?.matches ?? true; }

  onMounted(() => {
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    syncMotion();
    syncVisibility();
    motionQuery.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
  });
  onUnmounted(() => {
    stopWatching();
    cancelAnimationFrame(frame);
    intensitySpring.jump(1);
    warmthSpring.jump(0);
    motionQuery?.removeEventListener('change', syncMotion);
    document.removeEventListener('visibilitychange', syncVisibility);
    frameColor.value = undefined;
  });

  return { frameColor, running };
}
