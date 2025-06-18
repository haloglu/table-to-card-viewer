<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/utils/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const users = ref([]);

onMounted(async () => {
  const q = query(collection(db, "users"), orderBy("id"));
  const snapshot = await getDocs(q);
  users.value = snapshot.docs.map((doc) => ({
    id: doc.data().id,
    ...doc.data(),
  }));
});
</script>

<template>
  <div>
    <h2 class="mb-4 text-xl font-semibold flex items-center gap-2">
      <font-awesome-icon icon="fa-solid fa-users" />
      Kullanıcı Listesi
    </h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        <strong>{{ user.title }}</strong> — {{ user.description }} ({{
          user.status
        }})
      </li>
    </ul>
  </div>
</template>
