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
                <ul>
                  <!-- ✅ DURUM -->
                  <li
                    class="dropdown-section-title"
                    @click="toggleSection('status')"
                  >
                    Durum
                  </li>
                  <template v-if="openSection === 'status'">
                    <li
                      class="dropdown-sub-item"
                      :class="{ active: pendingSelectedStatus === '' }"
                      @click="selectPendingFilter('')"
                    >
                      Hepsi
                    </li>
                    <li
                      class="dropdown-sub-item"
                      :class="{ active: pendingSelectedStatus === 'Aktif' }"
                      @click="selectPendingFilter('Aktif')"
                    >
                      Aktif
                    </li>
                    <li
                      class="dropdown-sub-item"
                      :class="{ active: pendingSelectedStatus === 'Pasif' }"
                      @click="selectPendingFilter('Pasif')"
                    >
                      Pasif
                    </li>
                  </template>

                  <hr />

                  <!-- ✅ SIRALAMA -->
                  <li
                    class="dropdown-section-title"
                    @click="toggleSection('sort')"
                  >
                    Sıralama
                  </li>
                  <template v-if="openSection === 'sort'">
                    <li
                      class="dropdown-sub-item"
                      :class="{
                        active:
                          pendingSortKey === 'title' &&
                          pendingSortOrder === 'asc',
                      }"
                      @click="selectPendingSort('title', 'asc')"
                    >
                      İsim A-Z
                    </li>
                    <li
                      class="dropdown-sub-item"
                      :class="{
                        active:
                          pendingSortKey === 'title' &&
                          pendingSortOrder === 'desc',
                      }"
                      @click="selectPendingSort('title', 'desc')"
                    >
                      İsim Z-A
                    </li>
                    <li
                      class="dropdown-sub-item"
                      :class="{
                        active:
                          pendingSortKey === 'joinedAt' &&
                          pendingSortOrder === 'desc',
                      }"
                      @click="selectPendingSort('joinedAt', 'desc')"
                    >
                      En Yeni Önce
                    </li>
                    <li
                      class="dropdown-sub-item"
                      :class="{
                        active:
                          pendingSortKey === 'joinedAt' &&
                          pendingSortOrder === 'asc',
                      }"
                      @click="selectPendingSort('joinedAt', 'asc')"
                    >
                      En Eski Önce
                    </li>
                  </template>
                </ul>

                <!-- ✅ Resetle / Uygula Butonları -->
                <div class="dropdown-actions">
                  <button @click="applyFilters" class="apply-btn">
                    Uygula
                  </button>
                  <button @click="resetFilters">Resetle</button>
                </div>
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
        <div :key="currentPage">
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
              v-for="item in paginatedItems"
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
                  v-for="item in paginatedItems"
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

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <!-- Sol ok -->
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          title="Önceki Sayfa"
        >
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </button>

        <!-- Sayfa input -->
        <input
          type="number"
          class="pagination-input"
          v-model.number="currentPage"
          :min="1"
          :max="totalPages"
          @change="validatePage"
        />
        <span class="pagination-total">/ {{ totalPages }}</span>

        <!-- Sağ ok -->
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          title="Sonraki Sayfa"
        >
          <font-awesome-icon :icon="['fas', 'angle-right']" />
        </button>
      </div>
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

// Section aç/kapat
function toggleSection(section) {
  openSection.value = openSection.value === section ? "" : section;
}

// Pending filtre seçimi (Durum)
function selectPendingFilter(option) {
  pendingSelectedStatus.value = option;
}

// Pending sıralama seçimi (Sıralama)
function selectPendingSort(key, order = "asc") {
  pendingSortKey.value = key;
  pendingSortOrder.value = order;
}

// Uygula → Pending değerleri kaydet
function applyFilters() {
  selectedStatus.value = pendingSelectedStatus.value;
  sortKey.value = pendingSortKey.value;
  sortOrder.value = pendingSortOrder.value;

  showFilter.value = false;
  openSection.value = "";
}

// Resetle → Hem pending hem selected sıfırla
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

  // Status filtre
  if (selectedStatus.value) {
    result = result.filter((item) => item.status === selectedStatus.value);
  }

  // Search filtre
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

  // Sıralama
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

function validatePage() {
  if (currentPage.value < 1) currentPage.value = 1;
  if (currentPage.value > totalPages.value)
    currentPage.value = totalPages.value;
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

      // ✅ ALT SEÇENEK için özel stil (biraz içeri girsin + farklı arkaplan)
      &.dropdown-sub-item {
        padding-left: 20px; // Biraz içeri girinti
        background-color: #f9fafb; // Light mode

        body.dark & {
          background-color: #1f1f1f;
        }

        &:hover {
          background-color: #f3f4f6; // hover light

          body.dark & {
            background-color: #2a2a2a;
          }
        }

        &.active {
          background-color: #2563eb;
          color: #ffffff;
        }
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
  gap: 8px; // ARAYA BOŞLUK
  padding: 8px 12px;
  border-top: 1px solid #d1d5db;
  margin-top: 6px;

  button {
    flex: 1; // Butonlar eşit genişlikte olsun istersen
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
    background-color: #2563eb; // MAVİ
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

    // Number input arrows kaldır
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
body.dark {
  .pagination {
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

      // Number input arrows kaldır
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
