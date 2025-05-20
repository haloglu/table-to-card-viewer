<!-- components/TableRow.vue -->
<template>
  <tr>
    <td class="user-cell">
      <div class="avatar" :style="{ backgroundColor: getColor(title) }">
        {{ getInitials(title) }}
      </div>
      <span class="user-name">{{ title }}</span>
    </td>
    <td>{{ description }}</td>
    <td>{{ email }}</td>
    <td>{{ location }}</td>
    <td>{{ joinedAt }}</td>
    <td>{{ role }}</td>
    <td>
      <span :class="['status-chip', status.toLowerCase()]">
        {{ status }}
      </span>
    </td>
  </tr>
</template>

<script setup>
defineProps([
  "title",
  "description",
  "email",
  "location",
  "joinedAt",
  "role",
  "status",
]);

const getInitials = (name) => {
  const words = name.trim().split(" ");
  return (words[0][0] + (words.at(-1)?.[0] || "")).toUpperCase();
};

const getColor = (name) => {
  const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#3F51B5",
    "#03A9F4",
    "#009688",
    "#4CAF50",
    "#FF9800",
    "#795548",
    "#607D8B",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
</script>
<style scoped lang="scss">
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-size: 14px;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.status-chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;

  &.aktif {
    background-color: #10b981;
  }

  &.pasif {
    background-color: #ef4444;
  }
}

body.dark {
  .user-name {
    color: #f1f1f1;
  }

  .user-cell {
    color: #f1f1f1;

    .avatar {
      background-color: #333;
      color: #fff;
    }
  }
}
</style>
