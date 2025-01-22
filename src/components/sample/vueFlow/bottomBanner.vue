<script setup lang="ts">
import type { PropType } from "vue";
import type { Node } from "@vue-flow/core";

const props = defineProps({
  isOpenBanner: {
    type: Boolean,
    default: false
  },
  selectedNode: {
    type: Object as PropType<Node | null>,
    required: false
  }
});

const contents = [
  { id: "selectedNode", title: "Selected Node Data", data: {} },
  { id: "connectedNodes", title: "Node data up to the selected node", data: {} },
  { id: "connectedEdges", title: "Edge data up to the selected node", data: {} }
];
</script>

<template>
  <div
    :class="{ 'translate-y-full': !props.isOpenBanner, 'translate-y-0': isOpenBanner }"
    tabindex="-1"
    class="bottom-banner"
  >
    <div class="bottom-banner__header">
      <div class="bottom-banner__title">Selected Node Information</div>
      <button @click="$emit('close')" data-dismiss-target="#bottom-banner" type="button" class="close-button">
        <svg-icon name="close"></svg-icon>
      </button>
    </div>
    <!-- TODO: Selected Node Information -->
    <div class="bottom-banner__content">
      <div class="description">
        <div v-for="content in contents" :key="content.id" class="description-box">
          <h5 class="description-box__title">
            {{ content.title }}
          </h5>
          <p class="description-box__content">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus assumenda blanditiis dicta dolor
            dolores doloribus expedita in incidunt ipsam nam porro quae qui quis quod repellendus, tempore veritatis
            vitae!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottom-banner {
  @apply fixed w-full h-80 bottom-0 start-0 z-50 grid p-4 border-t border-gray-200 bg-gray-50 shadow-inner grid-rows-[auto,1fr] transition-transform duration-300;
}

.bottom-banner__header {
  @apply flex justify-between;
}

.bottom-banner__title {
  @apply text-2xl text-slate-500;
}

.close-button {
  @apply w-7 h-7 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white flex justify-center items-center;
}

.close-button img {
  @apply w-3 h-3;
}

.bottom-banner__content {
  @apply flex flex-col justify-center items-center text-2xl text-slate-500;
}

.description {
  @apply text-sm grid grid-cols-3 gap-10;
}

.description-box {
  @apply min-h-[220px] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-600 dark:border-gray-500 dark:hover:bg-gray-500;
}

.description-box__title {
  @apply mb-2 text-2xl font-bold tracking-tight dark:text-white;
}

.description-box__content {
  @apply font-normal text-gray-700 dark:text-gray-400;
}
</style>
