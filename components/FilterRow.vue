<template>
  <tr class="filter-row">
    <th></th>
    <!-- Kullanıcı -->
    <th></th>
    <!-- Pozisyon -->
    <th></th>
    <!-- Email -->
    <th>
      <FilterDropdown
        v-model="filters.location"
        :options="locationOptions"
        placeholder="Konum Seç"
      />
    </th>
    <th></th>
    <!-- Katılım -->
    <th>
      <FilterDropdown
        v-model="filters.role"
        :options="roleOptions"
        placeholder="Rol Seç"
      />
    </th>
    <th>
      <FilterDropdown
        v-model="filters.status"
        :options="statusOptions"
        placeholder="Durum Seç"
      />
    </th>
  </tr>
</template>

<script setup>
import { reactive, watch } from "vue";
import FilterDropdown from "./FilterDropdown.vue";

const props = defineProps({
  modelValue: Object,
  statusOptions: Array,
  roleOptions: Array,
  locationOptions: Array,
});

const emit = defineEmits(["update:modelValue"]);

const filters = reactive({
  status: props.modelValue?.status || "",
  role: props.modelValue?.role || "",
  location: props.modelValue?.location || "",
});

watch(filters, (newVal) => {
  emit("update:modelValue", { ...newVal });
});
</script>

<style scoped>
.filter-row {
  background-color: #f9f9f9;
}

.filter-row th {
  padding: 6px 8px;
}

@media (max-width: 768px) {
  .filter-row {
    display: none;
  }
}
</style>
