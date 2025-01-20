<script lang="ts" setup>
import {onMounted} from "vue";
import Login from "../../components/Login.vue";
import AiProcessor from '../../components/AiProcessor.vue';
import {useAuthStore} from "../../stores/authStore.ts";

const authStore = useAuthStore();
onMounted(() => { authStore.checkAuth(); })
</script>

<template>
  <AiProcessor v-if="authStore.isAuthenticated" msg="WXT + Vue" />
  <Login v-else @login="authStore.login"/>
</template>

<style scoped>
</style>
