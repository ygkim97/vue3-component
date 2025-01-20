<script setup lang="ts">
import { ref } from "vue";
import { Handle, Position } from "@vue-flow/core";
import { NodeToolbar } from "@vue-flow/node-toolbar";
import CloseIcon from "@/assets/images/icon/closIcon.vue";
import PenIcon from "@/assets/images/icon/penIcon.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const toolbarItemList = [
  { id: "delete", isComponent: true, componentPath: CloseIcon },
  { id: "info", isComponent: false, text: "i" },
  { id: "edit", isComponent: true, componentPath: PenIcon },
  { id: "start", isComponent: false, text: "▶︎" }
];

const nodeType = ref(props.data?.type);
const nodeLabel = ref(props.data?.label);
</script>

<template>
  <!-- TODO: toolbar component 분리 -->
  <NodeToolbar :is-visible="props.data.toolbarVisible" :position="Position.Bottom">
    <button
      v-for="item in toolbarItemList"
      :key="item.id"
      type="button"
      :class="{ selected: item.id === data.item?.id }"
      @click="$emit('onToolbarClick', item)"
    >
      <component v-if="item.isComponent" :is="item.componentPath" class="w-full h-full" />
      <span class="font-bold text-xl">{{ item.text }}</span>
    </button>
  </NodeToolbar>
  <Handle v-if="nodeType !== 'output'" type="source" :position="Position.Right" />
  {{ nodeLabel }}
  <Handle v-if="nodeType !== 'input'" type="target" :position="Position.Left" />
</template>

<style>
.vue-flow__node-toolbar {
  @apply flex flex-wrap gap-4 bg-gray-200 p-2 rounded-lg shadow-lg;
}

.vue-flow__node-toolbar button {
  @apply border-2 border-blue-900 rounded-full text-blue-900 flex justify-center items-center w-8 h-8 cursor-pointer p-1.5;
}

.vue-flow__node-toolbar button svg {
  @apply w-4 h-4;
}

.vue-flow__node-toolbar button.selected {
  @apply bg-blue-900;
}

.vue-flow__node-toolbar button:hover {
  @apply bg-gray-300;
}
</style>
