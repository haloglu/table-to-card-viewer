<template>
  <div class="page-size-selector">
    <select
      :id="id"
      v-model="internalValue"
      @change="$emit('update:modelValue', +internalValue)"
      class="selector-dropdown"
    >
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <span class="suffix">kayıt görüntüleniyor</span>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  options: {
    type: Array,
    default: () => [6, 12, 18, 24],
  },
  id: {
    type: String,
    default: "page-size",
  },
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  }
);

watch(internalValue, (val) => {
  emit("update:modelValue", +val);
});
</script>

<style scoped lang="scss">
.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  select {
    height: 38px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #f9fafb;
    font-size: 14px;
    color: #374151;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      border-color: #2563eb;
      background-color: #ffffff;
    }

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
  }

  .suffix {
    color: #6b7280;
    font-weight: 400;

    // Mobilde gizle
    @media (max-width: 768px) {
      display: none;
    }
  }

  // Dark mode
  body.dark & {
    select {
      background-color: #1f1f1f;
      color: #ddd;
      border-color: #444;

      &:hover {
        background-color: #2c2c2c;
        border-color: #60a5fa;
      }

      &:focus {
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
      }
    }

    .suffix {
      color: #aaa;
    }
  }
}
</style>
