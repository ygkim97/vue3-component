<script setup lang="ts">
import { onMounted, ref } from "vue";

import useDragAndDrop from "./useDragAndDrop.ts";
const { onDragStart } = useDragAndDrop();

const contentRefs = ref([]);
const contentHeights = ref({});
const accordionItems = ref([
  { id: "nodeDataControls", label: "Node & Data Controls (Button)" },
  { id: "nodeCollection", label: "Node Collection (Drag)" },
  { id: "scrollTest", label: "Contents Overflow Scroll Test" }
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
    <div class="vue-flow__sidebar-contents">
      <div v-for="item in accordionItems" :key="`item_${item.id}`" class="vue-flow__accordion">
        <button @click="toggleAccordion(item.id)" class="vue-flow__accordion-header">
          <span class="vue-flow__accordion-text">{{ item.label }}</span>
          <span class="vue-flow__accordion-icon">
            <svg-icon :name="accordionState[item.id] ? 'arrow-up' : 'arrow-down'"></svg-icon>
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
              <button type="button" @click="$emit('getJsonData', 'default')">Get JSON Data 1</button>
              <button type="button" @click="$emit('getJsonData', 'connection')">Get JSON Data 2</button>
              <button type="button" @click="$emit('createNode')">Create Node</button>
              <button type="button" @click="$emit('resetNode')">Reset Node</button>
            </div>
            <div v-else-if="item.id === 'nodeCollection'" class="vue-flow__drag-group">
              <div :draggable="true" @dragstart="onDragStart($event, 'input')">Input Node</div>
              <div :draggable="true" @dragstart="onDragStart($event, 'default')">Default Node</div>
              <div :draggable="true" @dragstart="onDragStart($event, 'output')">Output Node</div>
            </div>
            <div v-else-if="item.id === 'scrollTest'">
              <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aspernatur dicta harum ipsam nam
                necessitatibus perferendis quam, quia sequi veritatis? Commodi enim expedita illum inventore nisi, quam
                reprehenderit sit voluptatibus?
              </div>
              <div>
                Ab accusantium ad animi consectetur consequatur cupiditate delectus, deserunt explicabo iste, iusto
                labore nostrum odit perspiciatis praesentium quas quidem saepe sint sit, vel voluptatem! Consectetur
                exercitationem libero minima odio veniam.
              </div>
              <div>
                A alias atque beatae, dolor doloremque dolorum, eligendi eos error expedita facilis itaque iusto maxime
                nam nostrum pariatur possimus ratione rem repellendus reprehenderit saepe sed soluta velit! A, excepturi
                pariatur.
              </div>
              <div>
                Animi delectus dignissimos ducimus eligendi iusto laudantium non quas quisquam sit vitae. A animi
                debitis dicta dolorem error est fugit impedit nam neque, non officia, perspiciatis porro sequi tempora
                veniam!
              </div>
              <div>
                Accusantium, ad alias at, cum deserunt ea eligendi facere illo in ipsam laboriosam magnam minus
                necessitatibus nemo neque nobis omnis porro praesentium quae quaerat quam, quo similique sunt! Adipisci,
                quis.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style>
.vue-flow__sidebar {
  @apply w-[30vw] border-r-2 border-gray-200 grid grid-rows-[auto,1fr];
}

.vue-flow__sidebar-title {
  @apply font-bold text-center text-xl py-4 border-b-2 border-gray-200;
}

.vue-flow__sidebar-contents {
  @apply overflow-y-scroll;
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
  @apply w-32 h-10 text-white text-xs bg-blue-900 hover:bg-blue-900/90 font-medium rounded-lg;
}

.vue-flow__drag-group div {
  @apply w-32 h-10 rounded-full border-2 border-blue-900 flex items-center justify-center text-xs font-medium text-blue-900 cursor-grab !important;
}
</style>
