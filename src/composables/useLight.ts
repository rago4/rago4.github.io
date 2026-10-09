import { computed, ref } from 'vue';

interface LightPreset {
  id: string;
  label: string;
  brightness: number;
  warmth: number;
  color: string;
}

const defaultPreset = {
  id: 'lamp', label: 'Lamp', brightness: 90, warmth: 65, color: '#ffd89d',
} as const satisfies LightPreset;

export const presets = [
  { id: 'candle', label: 'Candle', brightness: 70, warmth: 100, color: '#f3ad55' },
  defaultPreset,
  { id: 'daylight', label: 'Daylight', brightness: 100, warmth: 10, color: '#fff5dc' },
] as const satisfies readonly LightPreset[];

export type PresetId = typeof presets[number]['id'];

export function useLight() {
  const brightness = ref<number>(defaultPreset.brightness);
  const warmth = ref<number>(defaultPreset.warmth);
  const warmthName = computed(() => warmth.value < 25 ? 'Soft white' : warmth.value < 55 ? 'Gentle' : warmth.value < 85 ? 'Warm' : 'Golden');
  const activePreset = computed(() => presets.find(preset => preset.brightness === brightness.value && preset.warmth === warmth.value)?.id);
  const color = computed(() => {
    // Blend soft white (#fff6de) into amber (#ffb968), then dim it.
    const warm = warmth.value / 100;
    const channels = [255, 246 - 61 * warm, 222 - 118 * warm];
    return '#' + channels
      .map(channel => Math.round(channel * brightness.value / 100).toString(16).padStart(2, '0'))
      .join('');
  });

  function applyPreset(id: PresetId) {
    const preset = presets.find(preset => preset.id === id);
    if (!preset) return;
    brightness.value = preset.brightness;
    warmth.value = preset.warmth;
  }

  return { brightness, warmth, warmthName, activePreset, color, applyPreset };
}
