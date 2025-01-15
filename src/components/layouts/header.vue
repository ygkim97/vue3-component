<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { computed } from "vue";
const route = useRoute();
const currentPath = computed(() => route.path);
console.log(currentPath.value);
const menuList = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" }
];
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <RouterLink to="/" class="navbar-logo">
        <img alt="Vue logo" src="@/assets/images/icon/vueLogo.svg" width="25" height="25" />
        <span class="navbar-logo-text">VUE3-COMPONENT</span>
      </RouterLink>
      <div class="navbar-menu" id="navbar-dropdown">
        <ul class="navbar-menu-list">
          <li v-for="menu in menuList">
            <RouterLink :to="menu.path" class="navbar-menu-item" :class="{ active: currentPath === menu.path }">
              {{ menu.name }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
