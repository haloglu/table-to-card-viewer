<template>
  <div class="view-container">
    <div class="view-box">
      <div class="filter-toggle-wrapper">
        <div class="filter-search-row">
          <PageSizeSelector v-model="pageSize" />

          <SearchInput @update:search="searchQuery = $event" />

          <div class="toggle-wrapper">
            <ToggleSwitch v-model="isCardView" />
          </div>
        </div>
      </div>

      <!-- Loading ayrı -->
      <div v-if="isLoading" class="loading-wrapper">
        <font-awesome-icon
          :icon="['fas', 'spinner']"
          spin
          class="loading-icon"
        />
      </div>

      <!-- View geçişleri -->
      <Transition name="fade" mode="out-in" tag="div">
        <component
          :is="isCardView ? 'section' : 'div'"
          :key="isCardView + '-' + currentPage"
          :class="isCardView ? 'card-grid' : 'table-wrapper'"
        >
          <!-- Card View -->
          <template v-if="filteredItems.length > 0 && isCardView">
            <TransitionGroup name="fade" class="card-grid">
              <CardItem
                v-for="item in paginatedItems"
                :key="item.id"
                v-bind="item"
              />
            </TransitionGroup>
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
                <template v-for="item in paginatedItems" :key="item.id">
                  <transition name="fade" tag>
                    <TableRow v-bind="item" />
                  </transition>
                </template>
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

      <!-- Pagination ve Sonuç Sayısı -->
      <div class="pagination-footer" v-if="!isLoading">
        <span class="result-count">
          Toplam
          <span
            ><b>{{ filteredItems.length }}</b></span
          >
          sonuçtan
          <span class="highlight-text">{{ paginatedItems.length }}</span> tanesi
          gösteriliyor.
        </span>

        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          @pageChange="goToPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { db } from "../src/utils/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import ToggleSwitch from "~/components/ToggleSwitch.vue";
import CardItem from "~/components/CardItem.vue";
import TableRow from "~/components/TableRow.vue";
import SearchInput from "~/components/SearchInput.vue";
import PageSizeSelector from "~/components/PageSizeSelector.vue";
import Pagination from "~/components/Pagination.vue";

// 🔥 Firebase'den veri çekiyoruz
const users = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  console.log("ENV CHECK:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
  const q = query(collection(db, "users"), orderBy("id"));
  const snapshot = await getDocs(q);
  users.value = snapshot.docs.map((doc) => ({
    id: doc.data().id,
    ...doc.data(),
  }));
  isLoading.value = false;
});

const searchQuery = ref("");
const isCardView = ref(true);
const currentPage = ref(1);
const pageSize = ref(6);

// Loading izleme
let timeout;
watch([searchQuery], () => {
  clearTimeout(timeout);
  isLoading.value = true;
  timeout = setTimeout(() => {
    isLoading.value = false;
  }, 800);
});
// Filtrelenmiş ve sıralanmış data
const filteredItems = computed(() => {
  let result = users.value;

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

  // if (sortKey.value) {
  //   result = [...result].sort((a, b) => {
  //     const aVal = a[sortKey.value];
  //     const bVal = b[sortKey.value];

  //     if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
  //     if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
  //     return 0;
  //   });
  // }

  if (!users.value.length) return [];

  return result;
});

watch(filteredItems, (val) => {
  console.log("Filtered items:", val);
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

.pagination-footer {
  margin-top: 16px;
  padding: 12px 0;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  .result-count {
    font-size: 14px;
    color: #6b7280;

    .highlight-text {
      color: #2563eb;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }
}

body.dark .pagination-footer {
  border-top: 1px solid #2e2e2e;

  .result-count {
    color: #a1a1aa;

    .highlight-text {
      color: #60a5fa;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
