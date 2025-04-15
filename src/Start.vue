<template>
  <div class="save-load-container">
    <!-- 原页面内容 -->
    <button @click="restart" class="restart-button">重新开始</button>
    <div v-for="(slot, index) in saveSlots" :key="index" class="save-slot">
      <span>{{ `存档${index + 1}` }}</span>
      <button @click="loadSlot(index)" class="load-button">读取</button>
    </div>

    <!-- 路由出口 -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 重新开始逻辑
const restart = () => {
  console.log("重新开始...")
  router.push({ name: 'Quiz', query: { action: 'restart', slotId: 0 } });
};

// 读取存档逻辑
const loadSlot = (index) => {
  router.push({ name: 'Quiz', query: { action: 'load', slotId: index } });
};

const saveSlots = ref(4); // 存档数量
</script>

<style scoped>
.save-load-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid #000;
}

.save-slot {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

</style>