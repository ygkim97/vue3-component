<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "./components/layouts/header.vue";
</script>

<template>
  <Header></Header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  padding: 20px;
}
</style>
