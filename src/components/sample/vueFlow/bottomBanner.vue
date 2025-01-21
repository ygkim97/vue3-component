<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";
import type { Node } from "@vue-flow/core";

const props = defineProps({
  selectedNode: {
    type: Object as PropType<Node | null>,
    required: false
  }
});

const isOpenBanner = computed(() => {
  return !!props.selectedNode;
});
</script>

<template>
  <div
    :class="{ 'translate-y-full': !isOpenBanner, 'translate-y-0': isOpenBanner }"
    tabindex="-1"
    class="bottom-banner"
  >
    <div class="close-button-wrapper">
      <button @click="$emit('close')" data-dismiss-target="#bottom-banner" type="button" class="close-button">
        <img src="@/assets/images/icon/close.svg" alt="close" />
      </button>
    </div>
    <!-- TODO: Selected Node Information -->
    <div class="banner-content">
      <div class="title">Selected Node Information</div>
      <div class="description">
        <ul>
          <li>Selected Node Data</li>
          <li>Node data up to the selected node</li>
          <li>Edge data up to the selected node</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottom-banner {
  @apply fixed w-full h-80 bottom-0 start-0 z-50 grid p-4 border-t border-gray-200 bg-gray-50 shadow-inner grid-rows-[auto,1fr] transition-transform duration-300;
}

.close-button-wrapper {
  @apply flex justify-end;
}

.close-button {
  @apply w-7 h-7 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white flex justify-center items-center;
}

.close-button img {
  @apply w-3 h-3;
}

.banner-content {
  @apply flex flex-col justify-center items-center text-2xl text-slate-500;
}

.banner-content > .title {
  @apply pb-2;
}

.banner-content > .description {
  @apply text-sm;
}
</style>
