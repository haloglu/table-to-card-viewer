<template>
  <div class="view-container">
    <div class="view-box">
      <div class="filter-toggle-wrapper">
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
                <li
                  v-for="option in ['', 'Aktif', 'Pasif']"
                  :key="option"
                  :class="{ active: selectedStatus === option }"
                  @click="selectFilter(option)"
                >
                  {{ option || "Hepsi" }}
                </li>
              </ul>
            </div>
          </transition>
        </div>

        <ToggleSwitch v-if="!isMobile" v-model="isCardView" />
      </div>

      <Transition name="fade" mode="out-in">
        <section v-if="isCardView" class="card-grid">
          <CardItem
            v-for="item in filteredItems"
            :key="item.id"
            :title="item.title"
            :description="item.description"
            :email="item.email"
            :location="item.location"
            :joined-at="item.joinedAt"
            :role="item.role"
            :status="item.status"
          />
        </section>

        <div v-else class="table-wrapper">
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
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import ToggleSwitch from "~/components/ToggleSwitch.vue";
import CardItem from "~/components/CardItem.vue";
import TableRow from "~/components/TableRow.vue";

const isCardView = ref(true);

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

const filteredItems = computed(() => {
  if (!selectedStatus.value) return items;
  return items.filter((item) => item.status === selectedStatus.value);
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
}

.view-box {
  width: 100%;
  max-width: 1200px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.filter-toggle-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

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
  overflow-x: auto;
  border-radius: 8px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 9999px;
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

/* 📱 Mobile Responsive */
@media (max-width: 768px) {
  .view-box {
    padding: 16px;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .data-table,
  .table-wrapper {
    display: none;
  }

  .filter-toggle-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .custom-dropdown {
    left: 0;
    right: auto;
  }
}
</style>
