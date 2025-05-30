<template>
  <div class="view-container">
    <div class="view-box">
      <div class="filter-toggle-wrapper">
        <div class="filter-search-row">
          <div class="filter-wrapper">
            <font-awesome-icon
              :icon="['fas', 'filter']"
              class="filter-icon-only"
              @click="showFilter = !showFilter"
              title="Filtrele"
            />
            <transition name="fade">
              <div v-if="showFilter" class="custom-dropdown">
                <!-- dropdown -->
              </div>
            </transition>
          </div>

          <SearchInput @update:search="searchQuery = $event" />

          <div class="toggle-wrapper">
            <ToggleSwitch v-model="isCardView" />
          </div>
        </div>
      </div>

      <Transition name="fade" mode="out-in">
        <div>
          <div v-if="isLoading" class="loading-wrapper">
            <font-awesome-icon
              :icon="['fas', 'spinner']"
              spin
              class="loading-icon"
            />
          </div>

          <section
            v-else-if="isCardView && filteredItems.length > 0"
            class="card-grid"
          >
            <CardItem
              v-for="item in filteredItems"
              :key="item.id"
              v-bind="item"
            />
          </section>

          <div
            v-else-if="!isCardView && filteredItems.length > 0"
            class="table-wrapper"
          >
            <table class="data-table">
              <thead>
                <tr>
                  <th>Kullanıcı</th>
                  <th>Pozisyon</th>
                  <th>Email</th>
                  <th>Lokasyon</th>
                  <th>Katılım</th>
                  <th>Rol</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                <TableRow
                  v-for="item in filteredItems"
                  :key="item.id"
                  v-bind="item"
                />
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state">
            <font-awesome-icon
              :icon="['fas', 'magnifying-glass']"
              class="empty-icon"
            />
            <p class="empty-message">
              Aradığınız kriterlere uygun sonuç bulunamadı.
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import ToggleSwitch from "~/components/ToggleSwitch.vue";
import CardItem from "~/components/CardItem.vue";
import TableRow from "~/components/TableRow.vue";
import SearchInput from "~/components/SearchInput.vue";

const searchQuery = ref("");

const isCardView = ref(true);

const isLoading = ref(false);

const items = [
  {
    id: 1,
    title: "Sertaç Can Haloğlu",
    description: "Frontend Developer",
    email: "sertac@company.com",
    location: "İstanbul, Türkiye",
    joinedAt: "2021-03-01",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: 2,
    title: "Ali Veli",
    description: "Backend Developer",
    email: "ali.veli@company.com",
    location: "Ankara, Türkiye",
    joinedAt: "2022-06-15",
    role: "Staff",
    status: "Pasif",
  },
  {
    id: 3,
    title: "Ayşe Yılmaz",
    description: "UI Designer",
    email: "ayse@company.com",
    location: "İzmir, Türkiye",
    joinedAt: "2020-11-22",
    role: "Designer",
    status: "Aktif",
  },
  {
    id: 4,
    title: "John Doe",
    description: "Product Manager",
    email: "john.doe@company.com",
    location: "New York, USA",
    joinedAt: "2019-08-10",
    role: "Manager",
    status: "Aktif",
  },
  {
    id: 5,
    title: "Elif Demir",
    description: "QA Engineer",
    email: "elif.demir@company.com",
    location: "Bursa, Türkiye",
    joinedAt: "2023-01-05",
    role: "Staff",
    status: "Pasif",
  },
  {
    id: 6,
    title: "Mehmet Koç",
    description: "DevOps Engineer",
    email: "mehmet.koc@company.com",
    location: "Berlin, Almanya",
    joinedAt: "2021-09-17",
    role: "Infrastructure",
    status: "Aktif",
  },
];

function selectFilter(option) {
  selectedStatus.value = option;
  showFilter.value = false;
}

const selectedStatus = ref("");
const showFilter = ref(false);

let timeout;
watch([searchQuery, selectedStatus], () => {
  clearTimeout(timeout);
  isLoading.value = true;
  timeout = setTimeout(() => {
    isLoading.value = false;
  }, 800);
});

const filteredItems = computed(() => {
  let result = items;

  if (selectedStatus.value) {
    result = result.filter((item) => item.status === selectedStatus.value);
  }

  if (searchQuery.value.trim() !== "") {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q)
    );
  }

  return result;
});

const isMobile = ref(false);

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) {
    isCardView.value = true;
  }
};

onMounted(() => {
  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIsMobile);
});
</script>

<style scoped lang="scss">
.view-container {
  display: flex;
  justify-content: center;
  padding: 24px;
  max-width: 100vw; // ✅ Taşmayı önler
  overflow-x: hidden; // ✅ Scrollbar'ı tamamen engeller
  box-sizing: border-box; // ✅ Padding düzgün hesaplanır
}

.view-box {
  width: 100%;
  max-width: 1200px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  overflow-x: hidden;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  min-height: 200px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-icon {
  font-size: 36px;
  color: #6b7280; // light mode için
}

/* 🌙 Dark Mode */
body.dark .loading-icon {
  color: #a1a1aa;
}

.filter-toggle-wrapper {
  margin-bottom: 20px;
}

.filter-wrapper {
  position: relative;
}

.toggle-mobile-fix {
  visibility: hidden; // başlangıçta gizle
  opacity: 0;
  transition: opacity 0.3s ease;

  margin: 0;
  align-self: center;
  transform: scale(0.9);
  cursor: pointer;

  @media (min-width: 769px) {
    visibility: visible;
    opacity: 1;
  }

  @media (max-width: 768px) {
    visibility: visible;
    opacity: 1;
    transform: scale(0.9);
    margin: 12px 0 0 0;
    align-self: flex-start;
    position: sticky;
    top: 12px;
    z-index: 10;
  }
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

.filter-search-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
}

.search-box {
  flex: 1;
  min-width: 0;
  position: relative;
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 32px;
}

// .search-box {
//   max-width: 280px;
//   width: 100%;
// }

.custom-dropdown {
  position: absolute;
  top: 38px;
  left: 0;
  min-width: 100px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 0;
  list-style: none;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  ul {
    list-style: none; // 🔥 Bu satır noktalardan kurtarır
    margin: 0;
    padding: 0;

    li {
      padding: 8px 12px;
      color: #374151;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;

      body.dark & {
        color: #f3f3f3;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.active {
        background-color: #2563eb;
        color: #ffffff;
      }
    }
  }
}

/* Card layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  overflow-x: hidden;
}

/* Table layout */
.data-table {
  width: 100%;
  min-width: 950px;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;

  thead {
    background-color: #f9fafb;

    th {
      text-align: left;
      padding: 12px 16px;
      font-weight: 600;
      font-size: 15px;
      color: #374151;
    }
  }

  td {
    padding: 12px 16px;
    border-top: 1px solid #f3f4f6;
    font-size: 14px;
    color: #4b5563;
  }
}

.table-wrapper {
  width: 100%;
  max-width: 100vw;
  overflow-x: auto;
  border-radius: 8px;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 9999px;
    cursor: pointer;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #999;
  }

  // 🌙 Dark mode scroll
  body.dark &::-webkit-scrollbar-thumb {
    background-color: #222;
  }

  body.dark &::-webkit-scrollbar-thumb:hover {
    background-color: #333;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
  opacity: 1;
  transform: scale(1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 🌙 Dark Mode */
body.dark {
  .view-box {
    background-color: #181818;
    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.04);
  }

  .filter-icon-only {
    background-color: #2c2c2c;
    color: #ccc;

    &:hover {
      background-color: #3a3a3a;
    }
  }

  .custom-dropdown {
    background-color: #2c2c2c;
    border-color: #444;

    li {
      color: #f3f3f3;

      &:hover {
        background-color: #3a3a3a;
      }

      &.active {
        background-color: #444;
      }
    }
  }

  .data-table {
    thead {
      background-color: #232323;

      th {
        color: #ddd;
      }
    }

    td {
      color: #ccc;
      border-top: 1px solid #333;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280; // Tailwind gray-500
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  background-color: #f9fafb;
  margin-top: 24px;
}

.empty-icon {
  font-size: 40px;
  color: #9ca3af;
}

.empty-message {
  font-size: 16px;
  font-weight: 500;
}

/* 🌙 Dark Mode */
body.dark {
  .empty-state {
    background-color: #1f1f1f;
    color: #ccc;
    border-color: #333;
  }

  .empty-icon {
    color: #999;
  }

  .empty-message {
    color: #ddd;
  }
}

/* 📱 Mobile Responsive */
@media (max-width: 768px) {
  .view-box {
    padding: 16px;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .custom-dropdown {
    left: 0;
    right: auto;
  }
}
</style>
