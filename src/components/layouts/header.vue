<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { computed } from "vue";
const route = useRoute();
const currentPath = computed(() => route.path);

const menuList = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "VueFlowDefault", path: "/sample/vueFlow/default" },
  { name: "VueFlowCustom", path: "/sample/vueFlow/custom" }
];
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <RouterLink to="/" class="navbar-logo">
        <svg-icon name="vue-logo" class="w-[25px] h-[25px]"></svg-icon>
        <span class="navbar-logo-text">VUE3-COMPONENT</span>
      </RouterLink>
      <div class="navbar-menu" id="navbar-dropdown">
        <ul class="navbar-menu-list">
          <li v-for="menu in menuList" :key="menu.name">
            <RouterLink :to="menu.path" class="navbar-menu-item" :class="{ active: currentPath === menu.path }">
              {{ menu.name }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
