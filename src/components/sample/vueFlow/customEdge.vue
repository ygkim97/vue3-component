<script setup lang="ts">
import { ref, watch, computed, defineEmits } from "vue";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from "@vue-flow/core";
import CustomMarker from "@/components/sample/vueFlow/customMarker.vue";

const { getSelectedEdges } = useVueFlow();

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  sourceX: {
    type: Number,
    required: true
  },
  sourceY: {
    type: Number,
    required: true
  },
  targetX: {
    type: Number,
    required: true
  },
  targetY: {
    type: Number,
    required: true
  },
  sourcePosition: {
    type: String,
    required: true
  },
  targetPosition: {
    type: String,
    required: true
  },
  markerEnd: {
    type: String,
    required: false
  },
  style: {
    type: Object,
    required: false
  },
  markerType: {
    type: String,
    required: false
  }
});

defineEmits<{
  (e: "removeEdge", id: string): void;
}>();

const selectedEdgeId = ref<string>("");

const path = computed(() => getBezierPath(props));
const useCustomMarker = computed(() => {
  return !!props.markerType;
});
const markerId = computed(() => `${props.id}-marker`);
const edgeColor = computed(() => {
  return selectedEdgeId.value === props.id ? "#1e3a8a" : "gray";
});

watch(getSelectedEdges, ([edges]) => {
  selectedEdgeId.value = edges?.id || "";
});
</script>

<template>
  <CustomMarker :id="markerId" :type="markerType" :fill="edgeColor"></CustomMarker>
  <BaseEdge
    :id="id"
    :style="{ stroke: edgeColor }"
    :path="path[0]"
    :marker-end="useCustomMarker ? `url(#${markerId})` : ''"
  />

  <EdgeLabelRenderer>
    <div
      v-if="selectedEdgeId === id"
      class="selectedEdge"
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`
      }"
    >
      <button class="edge-delete-button" @click="$emit('removeEdge', id)">
        <svg-icon name="close" class="close-icon"></svg-icon>
      </button>
    </div>
  </EdgeLabelRenderer>
</template>

<style>
.edge-delete-button {
  @apply flex bg-blue-900 text-white p-1 rounded-full;
}

.edge-delete-button .close-icon {
  @apply w-[6px] h-[6px];
}
</style>
