<template>
  <div class="card">
    <span class="status-chip" :class="status.toLowerCase()">
      {{ status }}
    </span>

    <div class="card-avatar">
      <div class="avatar" :style="{ backgroundColor: getColor(title) }">
        {{ getInitials(title) }}
      </div>
    </div>

    <div class="card-header">
      <h3 class="name">{{ title }}</h3>
      <p class="position">{{ description }}</p>
    </div>

    <div class="card-body">
      <p><font-awesome-icon icon="envelope" class="icon blue" />{{ email }}</p>
      <p>
        <font-awesome-icon icon="location-dot" class="icon green" />{{
          location
        }}
      </p>
      <p>
        <font-awesome-icon icon="calendar" class="icon amber" />{{ joinedAt }}
      </p>
      <p><font-awesome-icon icon="shield" class="icon indigo" />{{ role }}</p>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps({
  title: String,
  description: String,
  email: String,
  location: String,
  joinedAt: String,
  role: String,
  status: String,
});

const getInitials = (name) => {
  if (!name) return "";
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
.card {
  position: relative;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.status-chip {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 9999px;
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

.card-avatar {
  margin-bottom: 12px;

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    background-color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
  }
}

.card-header {
  text-align: center;
  margin-bottom: 10px;

  .name {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    color: #111827;
  }

  .position {
    font-size: 14px;
    color: #6b7280;
    margin-top: 4px;
  }
}

.card-body {
  width: 100%;
  font-size: 14px;
  color: #374151;
  display: flex;
  flex-direction: column;
  gap: 4px;

  p {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 6px 0;
  }

  .icon {
    width: 16px;
    height: 16px;
  }

  .blue {
    color: #3b82f6;
  }

  .green {
    color: #10b981;
  }

  .amber {
    color: #f59e0b;
  }

  .indigo {
    color: #6366f1;
  }
}
</style>
