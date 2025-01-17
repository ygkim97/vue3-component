<script setup>
import { onMounted, ref } from "vue";

import ArrowUpIcon from "@/assets/images/icon/ArrowUpIcon.vue";
import ArrowDownIcon from "@/assets/images/icon/ArrowDownIcon.vue";
import useDragAndDrop from "./dragAndDrop.ts";
const { onDragStart } = useDragAndDrop();

const contentRefs = ref([]);
const contentHeights = ref({});
const accordionItems = ref([
  { id: "nodeDataControls", label: "Node & Data Controls (Button)" },
  { id: "nodeCollection", label: "Node Collection (Drag)" }
]);
const accordionState = ref({});

const initializeAccordionState = () => {
  accordionItems.value.forEach((id) => {
    accordionState.value[id] = false;
  });
};

const updateContentHeight = () => {
  contentRefs.value.forEach((content) => {
    const id = content.id;
    contentHeights.value[id] = content.scrollHeight;
  });
};

const toggleAccordion = (id) => {
  accordionState.value[id] = !accordionState.value[id];
};

onMounted(() => {
  initializeAccordionState();
  updateContentHeight();
});
</script>

<template>
  <aside class="vue-flow__sidebar">
    <div class="vue-flow__sidebar-title">VUE FLOW</div>

    <!-- TODO: sidebar common component -->
    <!-- TODO: handle overflow content with scroll -->
    <div v-for="item in accordionItems" :key="`item_${item.id}`" class="vue-flow__accordion">
      <button @click="toggleAccordion(item.id)" class="vue-flow__accordion-header">
        <span class="vue-flow__accordion-text">{{ item.label }}</span>
        <span class="vue-flow__accordion-icon">
          <ArrowUpIcon v-if="accordionState[item.id]" />
          <ArrowDownIcon v-else />
        </span>
      </button>
      <div
        :id="item.id"
        class="vue-flow__accordion-content"
        :style="{
          maxHeight: accordionState[item.id] ? `${contentHeights[item.id]}px` : '0px'
        }"
        ref="contentRefs"
      >
        <div class="vue-flow__accordion-body">
          <div v-if="item.id === 'nodeDataControls'" class="vue-flow__button-group">
            <button type="button" @click="$emit('getJsonData')">Get JSON Data</button>
            <button type="button" @click="$emit('createNode')">Create Node</button>
            <button type="button" @click="$emit('resetNode')">Reset Node</button>
          </div>
          <div v-if="item.id === 'nodeCollection'" class="vue-flow__drag-group">
            <div :draggable="true" @dragstart="onDragStart($event, 'input')">Input Node</div>
            <div :draggable="true" @dragstart="onDragStart($event, 'default')">Default Node</div>
            <div :draggable="true" @dragstart="onDragStart($event, 'output')">Output Node</div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style>
.vue-flow__sidebar {
  @apply w-[25vw] border-r-2 border-gray-200;
}

.vue-flow__sidebar-title {
  @apply font-bold text-center text-xl py-4 border-b-2 border-gray-200;
}

/* Accordion */
.vue-flow__accordion {
  @apply border-b border-slate-200 px-4;
}

.vue-flow__accordion-header {
  @apply w-full flex justify-between items-center py-5 text-slate-800;
}

.vue-flow__accordion-text {
  @apply text-gray-600 font-bold;
}

.vue-flow__accordion-icon {
  @apply text-slate-800 transition-transform duration-300 w-4 h-4;
}

.vue-flow__accordion-content {
  @apply overflow-hidden transition-all duration-1000 ease-in-out;
}

.vue-flow__accordion-body {
  @apply pb-5 text-sm text-slate-500;
}

/* Button Group, Drag Group */
.vue-flow__button-group,
.vue-flow__drag-group {
  @apply grid grid-cols-2 gap-y-4 gap-x-2;
}

.vue-flow__button-group button {
  @apply w-36 h-10 text-white bg-blue-900 hover:bg-blue-900/90 focus:ring-4 focus:outline-none focus:ring-blue-900/50 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-blue-900/55 me-2 mb-2 justify-center;
}

.vue-flow__drag-group div {
  @apply w-36 h-10 rounded-full border-2 border-blue-900 flex items-center justify-center text-sm font-medium text-blue-900 cursor-grab !important;
}
</style>
