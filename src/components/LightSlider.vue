<script setup lang="ts">
const model = defineModel<number>({ required: true });
withDefaults(
  defineProps<{
    id: string;
    label: string;
    readout: string;
    valueText?: string;
    min?: number;
    max?: number;
    lowLabel: string;
    highLabel: string;
  }>(),
  { min: 0, max: 100 },
);
</script>

<template>
  <div class="setting" :class="{ 'setting--warm': id === 'warmth' }">
    <div class="setting-label">
      <label :for="id">{{ label }}</label>
      <output :for="id" :id="`${id}-value`">{{ readout }}</output>
    </div>
    <input
      :id="id"
      v-model.number="model"
      type="range"
      class="slider"
      :min="min"
      :max="max"
      :aria-valuetext="valueText || readout"
      :aria-describedby="`${id}-hint`"
      :style="{ '--progress': `${((model - min) / (max - min)) * 100}%` }"
    />
    <div :id="`${id}-hint`" class="range-hints">
      <span>{{ lowLabel }}</span
      ><span>{{ highLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.setting {
  margin-bottom: 26px;
}
.setting--warm {
  margin-bottom: 29px;
}

.setting-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 12px;
  font-weight: 500;
}

output {
  color: var(--muted);
  font-size: 11px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
}

.slider {
  appearance: none;
  display: block;
  width: 100%;
  height: 6px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: linear-gradient(to right, #a5815e var(--progress), #e5d6c3 var(--progress));
  cursor: pointer;
  touch-action: pan-y;
}

.setting--warm .slider {
  background: linear-gradient(to right, #fff7df, #ffd089 55%, #eba147);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 3px solid var(--surface);
  border-radius: 50%;
  background: #956b49;
  box-shadow: 0 1px 5px rgba(101, 68, 36, 0.2);
}

.slider::-moz-range-thumb {
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  border: 3px solid var(--surface);
  border-radius: 50%;
  background: #956b49;
  box-shadow: 0 1px 5px rgba(101, 68, 36, 0.2);
}

.range-hints {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: var(--muted);
  font-size: 10px;
}

@media (max-height: 630px) and (min-width: 501px) {
  .setting {
    margin-bottom: 18px;
  }
}
</style>
