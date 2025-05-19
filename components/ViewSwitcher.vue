<template>
  <div class="view-container">
    <div class="view-box">
      <div class="view-box-header">
        <ToggleSwitch v-if="!isMobile" v-model="isCardView" />
      </div>
      <Transition name="fade" mode="out-in">
        <section v-if="isCardView" class="card-grid">
          <CardItem
            v-for="item in items"
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
              <TableRow v-for="item in items" :key="item.id" v-bind="item" />
            </tbody>
          </table>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
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

.view-box-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.data-table {
  width: 100%;
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

.data-table {
  min-width: 950px; // Sütunların düzgün görünmesi için
  border-collapse: collapse;
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

@media (max-width: 768px) {
  .view-box {
    padding: 16px;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .data-table {
    display: none; // yine de table DOM'da durur ama görünmez olur
  }

  .table-wrapper {
    display: none;
  }
}
</style>
