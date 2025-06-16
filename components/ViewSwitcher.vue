<template>
  <div class="view-container">
    <div class="view-box">
      <div class="filter-toggle-wrapper">
        <div class="filter-search-row">
          <FilterDropdown
            :pendingSelectedStatus="pendingSelectedStatus"
            :pendingSortKey="pendingSortKey"
            :pendingSortOrder="pendingSortOrder"
            :showFilter="showFilter"
            :openSection="openSection"
            @update:pendingSelectedStatus="pendingSelectedStatus = $event"
            @update:pendingSortKey="pendingSortKey = $event"
            @update:pendingSortOrder="pendingSortOrder = $event"
            @update:showFilter="showFilter = $event"
            @update:openSection="openSection = $event"
            @apply-filters="applyFilters"
            @reset-filters="resetFilters"
          />

          <SearchInput @update:search="searchQuery = $event" />

          <div class="toggle-wrapper">
            <ToggleSwitch v-model="isCardView" />
          </div>
        </div>
      </div>
      <!-- ✅ Toplam sonuç sayısı -->
      <p class="result-count">
        Bu sayfada
        <span class="highlight-text"> {{ paginatedItems.length }}</span> sonuç
        görüntüleniyor
      </p>
      <!-- Loading ayrı -->
      <div v-if="isLoading" class="loading-wrapper">
        <font-awesome-icon
          :icon="['fas', 'spinner']"
          spin
          class="loading-icon"
        />
      </div>

      <!-- View geçişleri -->
      <Transition name="fade" mode="out-in">
        <component
          :is="isCardView ? 'section' : 'div'"
          :key="isCardView + '-' + currentPage"
          :class="isCardView ? 'card-grid' : 'table-wrapper'"
        >
          <!-- Card View -->
          <template v-if="filteredItems.length > 0 && isCardView">
            <CardItem
              v-for="item in paginatedItems"
              :key="item.id"
              v-bind="item"
            />
          </template>

          <!-- Table View -->
          <template v-else-if="filteredItems.length > 0 && !isCardView">
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
                  v-for="item in paginatedItems"
                  :key="item.id"
                  v-bind="item"
                />
              </tbody>
            </table>
          </template>

          <!-- Empty State -->
          <template v-else>
            <div class="empty-state">
              <font-awesome-icon
                :icon="['fas', 'magnifying-glass']"
                class="empty-icon"
              />
              <p class="empty-message">
                Aradığınız kriterlere uygun sonuç bulunamadı.
              </p>
            </div>
          </template>
        </component>
      </Transition>

      <!-- Pagination -->
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @pageChange="goToPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import ToggleSwitch from "~/components/ToggleSwitch.vue";
import CardItem from "~/components/CardItem.vue";
import TableRow from "~/components/TableRow.vue";
import SearchInput from "~/components/SearchInput.vue";
import FilterDropdown from "~/components/FilterDropdown.vue";
import Pagination from "~/components/Pagination.vue";

const searchQuery = ref("");
const isCardView = ref(true);
const isLoading = ref(false);

const currentPage = ref(1);
const pageSize = ref(6);

// Uygulanmış filtre değerleri
const selectedStatus = ref("");
const sortKey = ref("");
const sortOrder = ref("asc");

// Geçici (pending) değerler
const pendingSelectedStatus = ref(selectedStatus.value);
const pendingSortKey = ref(sortKey.value);
const pendingSortOrder = ref(sortOrder.value);

const showFilter = ref(false);
const openSection = ref(""); // '' | 'status' | 'sort'

// Demo item listesi
// Demo item listesi
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
  {
    id: 7,
    title: "Zeynep Kılıç",
    description: "Marketing Specialist",
    email: "zeynep.kilic@company.com",
    location: "İstanbul, Türkiye",
    joinedAt: "2020-05-12",
    role: "Marketing",
    status: "Aktif",
  },
  {
    id: 8,
    title: "Ahmet Arslan",
    description: "Data Analyst",
    email: "ahmet.arslan@company.com",
    location: "Ankara, Türkiye",
    joinedAt: "2021-11-09",
    role: "Data",
    status: "Pasif",
  },
  {
    id: 9,
    title: "Maria Rossi",
    description: "HR Specialist",
    email: "maria.rossi@company.com",
    location: "Rome, Italy",
    joinedAt: "2020-02-17",
    role: "HR",
    status: "Aktif",
  },
  {
    id: 10,
    title: "Kenan Duman",
    description: "System Administrator",
    email: "kenan.duman@company.com",
    location: "İzmir, Türkiye",
    joinedAt: "2018-12-03",
    role: "IT",
    status: "Pasif",
  },
  {
    id: 11,
    title: "Emily Clark",
    description: "UX Designer",
    email: "emily.clark@company.com",
    location: "London, UK",
    joinedAt: "2022-04-22",
    role: "Designer",
    status: "Aktif",
  },
  {
    id: 12,
    title: "Mustafa Yıldız",
    description: "Fullstack Developer",
    email: "mustafa.yildiz@company.com",
    location: "Antalya, Türkiye",
    joinedAt: "2021-07-14",
    role: "Developer",
    status: "Pasif",
  },
];

// ✅ Uygula → Pending değerleri kaydet
function applyFilters() {
  selectedStatus.value = pendingSelectedStatus.value;
  sortKey.value = pendingSortKey.value;
  sortOrder.value = pendingSortOrder.value;

  showFilter.value = false;
  openSection.value = "";
}

// ✅ Resetle → Hem pending hem selected sıfırla
function resetFilters() {
  selectedStatus.value = "";
  sortKey.value = "";
  sortOrder.value = "asc";

  pendingSelectedStatus.value = "";
  pendingSortKey.value = "";
  pendingSortOrder.value = "asc";

  showFilter.value = false;
  openSection.value = "";
}

// Loading izleme
let timeout;
watch([searchQuery, selectedStatus, sortKey, sortOrder], () => {
  clearTimeout(timeout);
  isLoading.value = true;
  timeout = setTimeout(() => {
    isLoading.value = false;
  }, 800);
});

// Filtrelenmiş ve sıralanmış data
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

  if (sortKey.value) {
    result = [...result].sort((a, b) => {
      const aVal = a[sortKey.value];
      const bVal = b[sortKey.value];

      if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
      return 0;
    });
  }

  return result;
});

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / pageSize.value);
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredItems.value.slice(start, end);
});

function goToPage(page) {
  if (page < 1) page = 1;
  if (page > totalPages.value) page = totalPages.value;
  currentPage.value = page;
}

// Mobil görünüm toggle
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
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
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
  color: #6b7280;
}

body.dark .loading-icon {
  color: #a1a1aa;
}

.filter-toggle-wrapper {
  margin-bottom: 20px;
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

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 1px;
  overflow-x: hidden;
}

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

  body.dark &::-webkit-scrollbar-thumb {
    background-color: #222;
  }

  body.dark &::-webkit-scrollbar-thumb:hover {
    background-color: #333;
  }
}

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

body.dark {
  .view-box {
    background-color: #181818;
    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.04);
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
  color: #6b7280;
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

body.dark .empty-state {
  background-color: #1f1f1f;
  color: #ccc;
  border-color: #333;
}

body.dark .empty-icon {
  color: #999;
}

body.dark .empty-message {
  color: #ddd;
}

@media (max-width: 768px) {
  .view-box {
    padding: 16px;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  opacity: 1;
  transform: scale(1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
