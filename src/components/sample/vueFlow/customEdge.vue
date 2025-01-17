<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from "@vue-flow/core";
import CloseIcon from "@/assets/images/icon/closIcon.vue";

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
  }
});

const selectedEdgeId = ref<string>("");

const path = computed(() => getBezierPath(props));

watch(getSelectedEdges, ([edges]) => {
  selectedEdgeId.value = edges?.id || "";
});
</script>

<template>
  <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" />

  <!-- TODO: Edge Markers Custom -->
  <EdgeLabelRenderer>
    <div
      v-if="selectedEdgeId === id"
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`
      }"
    >
      <button class="edge-delete-button" @click="$emit('removeEdge', id)">
        <CloseIcon class="w-[6px] h-[6px]"></CloseIcon>
      </button>
    </div>
  </EdgeLabelRenderer>
</template>

<style>
.edge-delete-button {
  @apply flex bg-blue-900 text-white p-1 rounded-full;
}
</style>
