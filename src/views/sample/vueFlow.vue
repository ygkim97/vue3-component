<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { VueFlow, Panel, useVueFlow } from "@vue-flow/core";
import type { Node, Connection } from "@vue-flow/core";
import { ControlButton, Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";

import CustomNode from "@/components/sample/vueFlow/customNode.vue";
import CustomEdge from "@/components/sample/vueFlow/customEdge.vue";
import Sidebar from "@/components/sample/vueFlow/sidebar.vue";
import DropzoneBackground from "@/components/sample/vueFlow/dropzoneBackground.vue";
import BottomBanner from "@/components/sample/vueFlow/bottomBanner.vue";
import useDragAndDrop from "@/components/sample/vueFlow/dragAndDrop.ts";
import { useVueFlowStore } from "@/stores/vueFlow/vueFlow.ts";

const { getSelectedNodes, setNodes } = useVueFlow();
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop();
const vueFlowStore = useVueFlowStore();
const { resetAll, getJsonData: fetchJsonData, addNode, addEdge, removeEdge } = vueFlowStore;
const { nodes, edges } = storeToRefs(vueFlowStore);

const selectedNode = ref<Node | null>(null);

/**
 * Bottom Banner Open
 */
watch(getSelectedNodes, ([node]) => {
  selectedNode.value = node || null;
});

/**
 * Test if the JSON data is being rendered correctly
 */
const getJsonData = () => {
  if (confirm("기존 노드가 초기화됩니다. 계속 진행하시겠습니까?")) {
    fetchJsonData();
  }
};

/**
 * Node create test
 */
const createNode = () => {
  const id = (nodes.value.length + 1).toString();
  addNode({
    id,
    type: "custom",
    position: { x: 200 * nodes.value.length, y: 0 },
    data: { type: id === "1" ? "input" : "default", label: `Node ${id}` }
  });
};

/**
 * Node reset test
 */
const resetNode = () => {
  resetAll();
};

/**
 * Test the added panel button
 */
const onPanelButton = () => {
  alert("PANEL BUTTON CLICK!");
};

/**
 * Test the added control button
 */
const onControlButton = () => {
  alert("CONTROL BUTTON CLICK!");
};

/**
 * Enable node connections
 */
const onConnect = (params: Connection) => {
  addEdge({
    id: `e${params.source}->${params.target}`,
    type: "custom",
    source: params.source,
    target: params.target
  });
};

/**
 * Toolbar Click Test
 * - Node delete
 * - Open modal
 * - Edit node label
 * - Edit edges and handles UI
 */
const onToolbarClick = ({ id }: { id: string }) => {
  // TODO: id 값에 따라 action 처리
  // delete: node delete, info: open the node info modal, edit: node label edit, start: enable edge animations and change the handle color.
  alert("TOOLBAR CLICK! ACTION = " + id);
};

/**
 * Bottom Banner Close
 */
const closeBanner = () => {
  const selectedId = selectedNode.value?.id;
  if (!selectedId) return;

  setNodes((nodes) => nodes.map((node) => (node.id === selectedId ? { ...node, selected: false } : node)));
  selectedNode.value = null;
};
</script>

<template>
  <div class="vue-flow-wrapper" @drop="onDrop">
    <Sidebar @getJsonData="getJsonData" @createNode="createNode" @resetNode="resetNode" />
    <!-- TODO: 해당 좌표에 이미 노드가 존재할 경우 처리 -->
    <VueFlow
      class="vue-flow"
      fit-view-on-init
      :nodes="nodes"
      :edges="edges"
      :default-viewport="{ zoom: 1.5 }"
      :min-zoom="0.2"
      :max-zoom="3"
      @connect="onConnect"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      :snap-to-grid="true"
      :snap-grid="[200, 100]"
    >
      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease'
        }"
      >
        <p v-if="isDragOver">Drop here</p>
      </DropzoneBackground>
      <Panel class="panel-button-group" position="top-left">
        <button type="button" @click="onPanelButton">Panel</button>
      </Panel>
      <MiniMap pannable zoomable maskColor="#aaa" />
      <template #node-custom="customNodeProps">
        <CustomNode :data="customNodeProps.data" @onToolbarClick="onToolbarClick" />
      </template>
      <template #edge-custom="customEdgeProps">
        <CustomEdge
          :id="customEdgeProps.id"
          :source-x="customEdgeProps.sourceX"
          :source-y="customEdgeProps.sourceY"
          :target-x="customEdgeProps.targetX"
          :target-y="customEdgeProps.targetY"
          :source-position="customEdgeProps.sourcePosition"
          :target-position="customEdgeProps.targetPosition"
          :marker-end="customEdgeProps.markerEnd"
          :style="customEdgeProps.style"
          @removeEdge="removeEdge"
        />
      </template>
      <Controls position="top-right">
        <ControlButton title="test button" @click="onControlButton">T</ControlButton>
      </Controls>
    </VueFlow>
    <BottomBanner :selectedNode="selectedNode" @close="closeBanner"></BottomBanner>
  </div>
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
@import "@vue-flow/controls/dist/style.css";
.vue-flow-wrapper {
  @apply h-full flex relative;
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

/* Panel Custom */
.panel-button-group button {
  @apply text-white bg-blue-900 hover:bg-blue-900/90 focus:ring-4 focus:outline-none focus:ring-blue-900/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-blue-900/55 me-2 mb-2;
}

/* Controls Custom */
.vue-flow__controls {
  @apply flex;
}
</style>
