<template>
  <div v-if="totalPages > 1" class="pagination">
    <!-- Sol ok -->
    <button
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="$emit('pageChange', currentPage - 1)"
      title="Önceki Sayfa"
    >
      <font-awesome-icon :icon="['fas', 'angle-left']" />
    </button>

    <!-- Sayfa input -->
    <input
      type="number"
      class="pagination-input"
      v-model.number="localPage"
      :min="1"
      :max="totalPages"
      @change="onInputChange"
    />
    <span class="pagination-total">/ {{ totalPages }}</span>

    <!-- Sağ ok -->
    <button
      class="pagination-btn"
      :disabled="currentPage === totalPages"
      @click="$emit('pageChange', currentPage + 1)"
      title="Sonraki Sayfa"
    >
      <font-awesome-icon :icon="['fas', 'angle-right']" />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["pageChange"]);

// Local copy of page (for input v-model)
const localPage = ref(props.currentPage);

watch(
  () => props.currentPage,
  (newVal) => {
    localPage.value = newVal;
  }
);

function onInputChange() {
  let page = localPage.value;
  if (page < 1) page = 1;
  if (page > props.totalPages) page = props.totalPages;
  emit("pageChange", page);
}
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 16px 0;

  .pagination-btn {
    background-color: #e5e7eb;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    color: #374151;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: #d1d5db;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .pagination-input {
    width: 48px;
    padding: 6px 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    text-align: center;
    font-size: 14px;
    color: #374151;
    background-color: #f9fafb;
    transition: background-color 0.2s, border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #2563eb;
    }

    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .pagination-total {
    font-size: 14px;
    color: #374151;
  }
}

/* 🌙 Dark mode */
body.dark .pagination {
  .pagination-btn {
    background-color: #2c2c2c;
    color: #f3f3f3;

    &:hover:not(:disabled) {
      background-color: #3a3a3a;
    }
  }

  .pagination-input {
    background-color: #2c2c2c;
    color: #f3f3f3;
    border-color: #444;

    &:focus {
      border-color: #2563eb;
    }

    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .pagination-total {
    color: #ccc;
  }
}
</style>
