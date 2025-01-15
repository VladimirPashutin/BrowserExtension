<template xmlns="http://www.w3.org/1999/html">
  <div>
    <header class="p-4 bg-gray-100">
      <nav v-if="authStore.isAuthenticated">
        <label>Нормальная работа</label>
        <NuxtPage/>
      </nav>
      <nav v-else class="flex gap-4">
        <NuxtLink to="/login" class="text-blue-500 hover:text-blue-600">Login</NuxtLink>
      </nav>
    </header>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

const authStore = useAuthStore()
onMounted(() => { authStore.checkAuth() })
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #54bc4ae0);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
