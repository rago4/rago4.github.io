<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Lamp, Maximize, Minimize } from '@lucide/vue';
import { presets } from '../composables/useLight';
import type { PresetId } from '../composables/useLight';
import LightSlider from './LightSlider.vue';

const brightness = defineModel<number>('brightness', { required: true });
const warmth = defineModel<number>('warmth', { required: true });
defineProps<{
  warmthName: string;
  activePreset?: PresetId;
  isFullscreen: boolean;
}>();
defineEmits<{
  preset: [id: PresetId];
  fullscreen: [];
  hide: [];
}>();

const hideButton = useTemplateRef<HTMLButtonElement>('hideButton');
defineExpose({
  focusHideControls() { hideButton.value?.focus({ preventScroll: true }); },
});
</script>

<template>
  <section class="panel" aria-labelledby="title">
    <header class="panel-header">
      <span class="lamp-badge" aria-hidden="true">
        <Lamp :size="24" :stroke-width="1.6" />
      </span>
      <button id="fullscreen" type="button" class="fullscreen-button"
        :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
        :title="isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'"
        @click="$emit('fullscreen')">
        <component :is="isFullscreen ? Minimize : Maximize" :size="16" :stroke-width="1.5" aria-hidden="true" />
      </button>
    </header>
    <h1 id="title">A light for reading.</h1>
    <p class="intro">Make yourself comfortable.</p>
    <div class="presets" role="group" aria-label="Light presets">
      <button v-for="preset in presets" :key="preset.id" type="button" class="preset"
        :aria-pressed="activePreset === preset.id" @click="$emit('preset', preset.id)">
        <span class="swatch" :style="{ backgroundColor: preset.color }" aria-hidden="true"></span>
        {{ preset.label }}
      </button>
    </div>
    <LightSlider
      id="brightness" v-model="brightness" label="Brightness" :min="5"
      :readout="`${brightness}%`" :value-text="`${brightness} percent`"
      low-label="Soft glow" high-label="Shine bright"
    />
    <LightSlider
      id="warmth" v-model="warmth" label="Warmth" :readout="warmthName"
      low-label="Morning light" high-label="Golden hour"
    />
    <button id="read" ref="hideButton" type="button" class="hide-button" @click="$emit('hide')">
      Hide controls
    </button>
  </section>
</template>

<style scoped>
.panel {
  width: 350px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 24px;
  background: rgba(255, 248, 235, 0.95);
  box-shadow: 0 16px 60px rgba(85, 53, 20, 0.08), 0 2px 6px rgba(85, 53, 20, 0.03);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 23px;
}

.lamp-badge {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #efdfc8;
  color: var(--accent);
}

.fullscreen-button {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--muted);
  transition: background-color 150ms ease;
}

.fullscreen-button:hover { background: #eddfcd; }

h1 {
  margin: 0 0 12px;
  font-family: "Lora", Georgia, serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -1.2px;
}

.intro {
  margin: 0 0 28px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}

.presets {
  display: flex;
  gap: 6px;
  margin-bottom: 29px;
  padding: 5px;
  border-radius: 12px;
  background: #eee2d2;
}

.preset {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
  padding: 7px 3px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-size: 11px;
  transition: background-color 150ms ease, color 150ms ease;
}

.preset:hover { color: var(--ink); }

.preset[aria-pressed="true"] {
  border-color: #fff;
  background: #fffaf0;
  color: var(--ink);
  box-shadow: 0 2px 5px rgba(77, 49, 20, 0.06);
}

.swatch {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border: 1px solid rgba(141, 93, 39, 0.13);
  border-radius: 50%;
}

.hide-button {
  display: block;
  width: 100%;
  min-height: 46px;
  padding: 0 15px;
  border: 1px solid #745033;
  border-radius: 11px;
  background: #805a3d;
  color: var(--surface);
  font-size: 12px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(81, 53, 20, 0.08);
  transition: background-color 150ms ease;
}

.hide-button:hover { background: #6e4930; }

@media (max-width: 500px) {
  .panel { width: 100%; max-width: 350px; padding: 25px; }
}

@media (max-height: 630px) and (min-width: 501px) {
  .panel { padding: 20px 24px; }
  .panel-header { margin-bottom: 12px; }
  h1 { font-size: 30px; }
  .intro, .presets { margin-bottom: 18px; }
}
</style>
