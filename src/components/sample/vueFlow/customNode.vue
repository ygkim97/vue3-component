<script setup lang="ts">
import { ref } from "vue";
import { Handle, Position } from "@vue-flow/core";
import { NodeToolbar } from "@vue-flow/node-toolbar";

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const toolbarItemList = [
  { id: "delete", isIcon: true, iconName: "close" },
  { id: "info", isIcon: false, text: "i" },
  { id: "edit", isIcon: true, iconName: "pen" },
  { id: "start", isIcon: false, text: "▶︎" }
];

const nodeType = ref(props.data?.type);
const nodeLabel = ref(props.data?.label);
</script>

<template>
  <!-- TODO: toolbar component -->
  <NodeToolbar :is-visible="props.data.toolbarVisible" :position="Position.Bottom">
    <button
      v-for="item in toolbarItemList"
      :key="item.id"
      type="button"
      :class="{ selected: item.id === data.item?.id }"
      @click="$emit('onToolbarClick', item)"
    >
      <svg-icon v-if="item.isIcon" :name="item.iconName" class="toolbar-icon"></svg-icon>
      <span v-else class="font-bold text-xl">{{ item.text }}</span>
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

.vue-flow__node-toolbar button > .toolbar-icon {
  @apply w-4 h-4;
}

.vue-flow__node-toolbar button.selected {
  @apply bg-blue-900;
}

.vue-flow__node-toolbar button:hover {
  @apply bg-gray-300;
}
</style>
