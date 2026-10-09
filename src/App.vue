<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { SlidersHorizontal } from '@lucide/vue';
import LightPanel from './components/LightPanel.vue';
import { useLight } from './composables/useLight';
import type { PresetId } from './composables/useLight';
import { useScreen } from './composables/useScreen';
import { useCandleFlicker } from './composables/useCandleFlicker';

const { brightness, warmth, warmthName, activePreset, selectedPreset, kelvin, color, applyPreset } = useLight();
const candleEnabled = computed(() => selectedPreset.value === 'candle');
const { frameColor, running } = useCandleFlicker(candleEnabled, kelvin, brightness);
const displayedColor = computed(() => frameColor.value ?? color.value);
const { isFullscreen, status, toggleFullscreen, keepAwake } = useScreen();
const controlsVisible = ref(true);
const restore = useTemplateRef<HTMLButtonElement>('restore');
const panel = useTemplateRef<InstanceType<typeof LightPanel>>('panel');
const lightTransitionDuration = ref<150 | 400>(150);

watch([displayedColor, lightTransitionDuration, running], ([value, duration, flickering]) => {
  document.documentElement.style.setProperty('--light-duration', flickering ? '0ms' : `${duration}ms`);
  document.documentElement.style.setProperty('--light', value);
}, { immediate: true });

watch(color, value => {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value);
}, { immediate: true });

function selectPreset(id: PresetId) {
  lightTransitionDuration.value = 400;
  applyPreset(id);
}

function setBrightness(value: number) {
  lightTransitionDuration.value = 150;
  brightness.value = Math.min(100, Math.max(5, value));
}

function setWarmth(value: number) {
  lightTransitionDuration.value = 150;
  warmth.value = value;
}

async function setControlsVisible(visible: boolean) {
  controlsVisible.value = visible;
  if (!visible) keepAwake();
  await nextTick();
  if (visible) panel.value?.focusHideControls();
  else restore.value?.focus({ preventScroll: true });
}

function handleKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
  switch (event.key.toLowerCase()) {
    case 'h': event.preventDefault(); setControlsVisible(!controlsVisible.value); break;
    case 'f': event.preventDefault(); toggleFullscreen(); break;
    case 'escape': if (!controlsVisible.value) setControlsVisible(true); break;
    case 'arrowup': event.preventDefault(); setBrightness(brightness.value + 5); break;
    case 'arrowdown': event.preventDefault(); setBrightness(brightness.value - 5); break;
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <main class="lamp" aria-label="Reading light">
    <LightPanel
      v-show="controlsVisible" ref="panel" :brightness="brightness" :warmth="warmth"
      :warmth-name="warmthName" :active-preset="activePreset" :is-fullscreen="isFullscreen"
      @update:brightness="setBrightness" @update:warmth="setWarmth"
      @preset="selectPreset" @fullscreen="toggleFullscreen" @hide="setControlsVisible(false)"
    />
    <button
      v-if="!controlsVisible" id="restore" ref="restore" type="button" class="restore"
      aria-label="Show light controls" title="Show controls (H)" @click="setControlsVisible(true)"
    >
      <SlidersHorizontal :size="16" :stroke-width="1.5" aria-hidden="true" />
      <span>Adjust light</span>
    </button>
    <p v-if="!controlsVisible" class="reading-hint">
      Enjoy your chapter. Press H to adjust the light.
    </p>
    <p role="status" class="status">{{ status }}</p>
  </main>
</template>

<style scoped>
.lamp {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 40px;
}

.restore {
  position: fixed;
  right: 28px;
  bottom: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 246, 229, 0.2);
  border-radius: 30px;
  background: rgba(255, 247, 229, 0.3);
  color: var(--ink);
  font-size: 11px;
  opacity: 0.25;
  transition: opacity 150ms ease;
}

.restore:hover, .restore:focus-visible { opacity: 1; }

.reading-hint {
  position: fixed;
  right: 28px;
  bottom: 85px;
  margin: 0;
  font-size: 11px;
  pointer-events: none;
  animation: hint-away 5s forwards;
}

.status {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: calc(100% - 40px);
  margin: 0;
  font-size: 12px;
  text-align: center;
}

.status:not(:empty) {
  padding: 12px 18px;
  border-radius: 12px;
  background: var(--surface);
  box-shadow: 0 4px 20px rgba(81, 53, 20, 0.08);
}

@keyframes hint-away {
  0%, 60% { opacity: 0.7; }
  100% { opacity: 0; }
}

@media (max-width: 500px) {
  .lamp { align-items: center; justify-content: center; padding: 20px; }
  .restore { right: 20px; bottom: 20px; }
  .reading-hint { right: 20px; max-width: calc(100% - 40px); }
}

@media (max-height: 630px) and (min-width: 501px) {
  .lamp { align-items: center; padding: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .reading-hint { animation: none; }
}
</style>
