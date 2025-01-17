<script lang="ts" setup>
import { Background } from "@vue-flow/background";
</script>

<template>
  <div class="dropzone-background">
    <Background variant="dots" :gap="16" :size="1" pattern-color="#aaa" />

    <div class="overlay">
      <slot />
    </div>
  </div>
</template>

<style>
.dropzone-background {
  @apply relative w-full h-full;
}

.dropzone-background .overlay {
  @apply absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 pointer-events-none  text-7xl font-bold;
}
</style>
