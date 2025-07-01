<template>
  <tr class="filter-row">
    <th>
      <FilterDropdown
        v-model="filters.title"
        :options="titleOptions"
        placeholder="İsim"
      />
    </th>

    <th>
      <FilterDropdown
        v-model="filters.description"
        :options="descriptionOptions"
        placeholder="Pozisyon"
      />
    </th>

    <th>
      <FilterDropdown
        v-model="filters.email"
        :options="emailOptions"
        placeholder="Email"
      />
    </th>

    <th>
      <FilterDropdown
        v-model="filters.location"
        :options="locationOptions"
        placeholder="Konum"
      />
    </th>

    <th>
      <FilterDropdown
        v-model="filters.joinDate"
        :options="joinDateOptions"
        placeholder="Katılım"
      />
    </th>

    <th>
      <FilterDropdown
        v-model="filters.role"
        :options="roleOptions"
        placeholder="Rol"
      />
    </th>

    <th>
      <FilterDropdown
        v-model="filters.status"
        :options="statusOptions"
        placeholder="Durum"
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
  titleOptions: Array,
  descriptionOptions: Array,
  emailOptions: Array,
  joinDateOptions: Array,
});

const emit = defineEmits(["update:modelValue"]);

const filters = reactive({
  title: props.modelValue?.title || "",
  description: props.modelValue?.description || "",
  email: props.modelValue?.email || "",
  joinDate: props.modelValue?.joinDate || "",
  location: props.modelValue?.location || "",
  role: props.modelValue?.role || "",
  status: props.modelValue?.status || "",
});

// Watcher: reactive filters değiştikçe parent'e bildirme
watch(
  filters,
  () => {
    emit("update:modelValue", { ...filters });
  },
  { deep: true }
);

// 🔄 Reset fonksiyonu
function resetFilters() {
  emit("update:modelValue", {
    title: "",
    description: "",
    email: "",
    joinDate: "",
    location: "",
    role: "",
    status: "",
  });
}
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
