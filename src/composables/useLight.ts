import { computed, ref } from "vue";
import { lightColor, warmthToKelvin } from "../utils/lightColor";

interface LightPreset {
  id: string;
  label: string;
  brightness: number;
  warmth: number;
}

const defaultPreset = {
  id: "lamp",
  label: "Lamp",
  brightness: 90,
  warmth: 65,
} as const satisfies LightPreset;

export const presets = [
  { id: "candle", label: "Candle", brightness: 70, warmth: 100 },
  defaultPreset,
  { id: "daylight", label: "Daylight", brightness: 100, warmth: 0 },
] as const satisfies readonly LightPreset[];

export type PresetId = (typeof presets)[number]["id"];

export function useLight() {
  const brightness = ref<number>(defaultPreset.brightness);
  const warmth = ref<number>(defaultPreset.warmth);
  const selectedPreset = ref<PresetId>(defaultPreset.id);
  const warmthName = computed(() =>
    warmth.value < 25
      ? "Soft white"
      : warmth.value < 55
        ? "Gentle"
        : warmth.value < 85
          ? "Warm"
          : "Golden",
  );
  const activePreset = computed(
    () =>
      presets.find(
        (preset) => preset.brightness === brightness.value && preset.warmth === warmth.value,
      )?.id,
  );
  const kelvin = computed(() => warmthToKelvin(warmth.value));
  const color = computed(() => lightColor(kelvin.value, brightness.value));

  function applyPreset(id: PresetId) {
    const preset = presets.find((preset) => preset.id === id);
    if (!preset) return;
    brightness.value = preset.brightness;
    warmth.value = preset.warmth;
    selectedPreset.value = id;
  }

  return {
    brightness,
    warmth,
    warmthName,
    activePreset,
    selectedPreset,
    kelvin,
    color,
    applyPreset,
  };
}
