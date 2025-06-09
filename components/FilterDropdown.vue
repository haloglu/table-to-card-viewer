<template>
  <div class="filter-wrapper">
    <font-awesome-icon
      :icon="['fas', 'filter']"
      class="filter-icon-only"
      @click="$emit('update:showFilter', !showFilter)"
      title="Filtrele"
    />

    <transition name="fade">
      <div v-if="showFilter" class="custom-dropdown">
        <ul>
          <!-- ✅ DURUM -->
          <li
            class="dropdown-section-title"
            @click="
              $emit(
                'update:openSection',
                openSection === 'status' ? '' : 'status'
              )
            "
          >
            Durum
          </li>
          <template v-if="openSection === 'status'">
            <li
              class="dropdown-sub-item"
              :class="{ active: pendingSelectedStatus === '' }"
              @click="$emit('update:pendingSelectedStatus', '')"
            >
              Hepsi
            </li>
            <li
              class="dropdown-sub-item"
              :class="{ active: pendingSelectedStatus === 'Aktif' }"
              @click="$emit('update:pendingSelectedStatus', 'Aktif')"
            >
              Aktif
            </li>
            <li
              class="dropdown-sub-item"
              :class="{ active: pendingSelectedStatus === 'Pasif' }"
              @click="$emit('update:pendingSelectedStatus', 'Pasif')"
            >
              Pasif
            </li>
          </template>

          <hr />

          <!-- ✅ SIRALAMA -->
          <li
            class="dropdown-section-title"
            @click="
              $emit('update:openSection', openSection === 'sort' ? '' : 'sort')
            "
          >
            Sıralama
          </li>
          <template v-if="openSection === 'sort'">
            <li
              class="dropdown-sub-item"
              :class="{
                active:
                  pendingSortKey === 'title' && pendingSortOrder === 'asc',
              }"
              @click="
                $emit('update:pendingSortKey', 'title');
                $emit('update:pendingSortOrder', 'asc');
              "
            >
              İsim A-Z
            </li>
            <li
              class="dropdown-sub-item"
              :class="{
                active:
                  pendingSortKey === 'title' && pendingSortOrder === 'desc',
              }"
              @click="
                $emit('update:pendingSortKey', 'title');
                $emit('update:pendingSortOrder', 'desc');
              "
            >
              İsim Z-A
            </li>
            <li
              class="dropdown-sub-item"
              :class="{
                active:
                  pendingSortKey === 'joinedAt' && pendingSortOrder === 'desc',
              }"
              @click="
                $emit('update:pendingSortKey', 'joinedAt');
                $emit('update:pendingSortOrder', 'desc');
              "
            >
              En Yeni Önce
            </li>
            <li
              class="dropdown-sub-item"
              :class="{
                active:
                  pendingSortKey === 'joinedAt' && pendingSortOrder === 'asc',
              }"
              @click="
                $emit('update:pendingSortKey', 'joinedAt');
                $emit('update:pendingSortOrder', 'asc');
              "
            >
              En Eski Önce
            </li>
          </template>
        </ul>

        <!-- ✅ Resetle / Uygula Butonları -->
        <div class="dropdown-actions">
          <button @click="$emit('apply-filters')" class="apply-btn">
            Uygula
          </button>
          <button @click="$emit('reset-filters')">Resetle</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  pendingSelectedStatus: String,
  pendingSortKey: String,
  pendingSortOrder: String,
  showFilter: Boolean,
  openSection: String,
});

defineEmits([
  "update:pendingSelectedStatus",
  "update:pendingSortKey",
  "update:pendingSortOrder",
  "update:showFilter",
  "update:openSection",
  "apply-filters",
  "reset-filters",
]);
</script>

<style scoped lang="scss">
.filter-wrapper {
  position: relative;
}

.filter-icon-only {
  font-size: 16px;
  padding: 8px;
  border-radius: 8px;
  background-color: #e5e7eb;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #d1d5db;
  }
}

body.dark .filter-icon-only {
  background-color: #3a3a3a;
  color: #f3f3f3;

  &:hover {
    background-color: #4a4a4a;
  }
}

.custom-dropdown {
  position: absolute;
  top: 38px;
  left: 0;
  min-width: 160px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 0;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: 8px 12px;
      color: #374151;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.active {
        background-color: #2563eb;
        color: #ffffff;
      }

      &.dropdown-sub-item {
        padding-left: 20px;
        background-color: #f9fafb;

        &:hover {
          background-color: #f3f4f6;
        }

        &.active {
          background-color: #2563eb;
          color: #ffffff;
        }
      }
    }
  }
}

body.dark .custom-dropdown {
  background-color: #2c2c2c;
  border-color: #444;

  li {
    color: #e0e0e0;

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }

    &.active {
      background-color: #2563eb;
      color: #ffffff;
    }

    &.dropdown-sub-item {
      background-color: #1f1f1f;

      &:hover {
        background-color: #2a2a2a;
      }

      &.active {
        background-color: #2563eb;
        color: #ffffff;
      }
    }
  }
}

.dropdown-section-title {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  cursor: default;
  user-select: none;
}

body.dark .dropdown-section-title {
  color: #999;
}

.dropdown-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid #d1d5db;
  margin-top: 6px;

  button {
    flex: 1;
    padding: 6px 12px;
    font-size: 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background-color: #e5e7eb;
    color: #374151;
    transition: background-color 0.2s;

    &:hover {
      background-color: #d1d5db;
    }
  }

  .apply-btn {
    background-color: #2563eb;
    color: #fff;

    &:hover {
      background-color: darken(#2563eb, 5%);
    }
  }
}

body.dark .dropdown-actions {
  border-color: #444;

  button {
    background-color: #3a3a3a;
    color: #f3f3f3;

    &:hover {
      background-color: #555;
    }
  }

  .apply-btn {
    background-color: #2563eb;
    color: #fff;

    &:hover {
      background-color: darken(#2563eb, 5%);
    }
  }
}
</style>
