<script setup lang="ts">
import { ref, defineEmits, computed } from "vue";
import { Handle, Position } from "@vue-flow/core";
import { NodeToolbar } from "@vue-flow/node-toolbar";
import { ProcessStatus } from "@/constants/vueFlow.ts";

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

defineEmits<{
  (e: "onToolbarClick", item: { id: string }): void;
}>();

const nodeLabel = computed(() => {
  return props.data?.label;
});

const handleClass = computed(() => {
  // handle color class setting
  const status = props.data?.status;
  let inputHandle = "";
  let outputHandle = "";

  if (status) {
    inputHandle = status === ProcessStatus.FAIL ? "handle_error" : "handle_success";
    outputHandle =
      status === ProcessStatus.SUCCESS ? "handle_success" : status === ProcessStatus.ERROR ? "handle_error" : "";
  }

  return { inputHandle, outputHandle };
});

const toolbarItemList = [
  { id: "delete", isIcon: true, iconName: "close" },
  { id: "info", isIcon: false, text: "i" },
  { id: "edit", isIcon: true, iconName: "pen" },
  { id: "start", isIcon: false, text: "▶︎" }
];

const nodeType = ref(props.data?.type);
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
      <svg-icon v-if="item.isIcon" :name="item.iconName"></svg-icon>
      <span v-else class="font-bold text-xl">{{ item.text }}</span>
    </button>
  </NodeToolbar>
  <Handle v-if="nodeType !== 'input'" type="target" :position="Position.Left" :class="handleClass.inputHandle" />
  <div v-if="data.status === ProcessStatus.RUNNING" class="spinner" />
  <span v-else class="vue-flow__node-label" :title="nodeLabel">{{ nodeLabel }}</span>
  <Handle v-if="nodeType !== 'output'" type="source" :position="Position.Right" :class="handleClass.outputHandle" />
</template>

<style>
.vue-flow__node-toolbar {
  @apply flex flex-wrap gap-2 bg-gray-200 px-2 py-1 border rounded-lg shadow-lg;
}

.vue-flow__node-toolbar button {
  @apply border-2 border-blue-900 rounded-full text-blue-900 flex justify-center items-center w-7 h-7 cursor-pointer p-1.5;
}

.vue-flow__node-toolbar button.selected {
  @apply bg-blue-900;
}

.vue-flow__node-toolbar button:hover {
  @apply bg-gray-300;
}

/* Node Custom */
.vue-flow__node {
  @apply w-36 h-10 rounded-full border-2 border-blue-900 flex items-center justify-center text-sm font-medium text-blue-900 bg-white !important;
}

.vue-flow__node.selected {
  @apply bg-blue-900 text-white !important;
}

/* Handle Custom */
.vue-flow__handle {
  @apply w-2 h-2 border-blue-900 border-2 bg-white !important;
}

.handle_error {
  @apply bg-red-600 !important;
}

.handle_success {
  @apply bg-green-700 !important;
}

/* Spinner */
.spinner {
  position: absolute;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.vue-flow__node-label {
  @apply truncate w-full text-center block px-4;
}
</style>
