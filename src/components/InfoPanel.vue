<script setup lang="ts">
const props = defineProps<{info: string}>();
const emits = defineEmits(['close']);
</script>

<template>
  <div class="infoPanel">
    <h4>{{info}}</h4>
    <button type="reset" @click = "$emit('close')">Закрыть</button>
  </div>
</template>

<style scoped>
  .infoPanel {
    background-color: #f2f3f7;
    border: 1px solid black;
    position: fixed;
    left: 800px;
    top: 50px;
  }
</style>