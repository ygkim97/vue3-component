<script setup lang="ts">
import { ref } from "vue";
import { VueFlow, useVueFlow, Panel } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { ControlButton, Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";

import CustomNode from "@/components/sample/vueFlow/customNode.vue";
import { useVueFlowStore } from "@/stores/vueFlow/vueFlow.ts";

const { addEdges } = useVueFlow();
const vueFlowStore = useVueFlowStore();
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

// NOTE: test if the JSON data is being rendered correctly
const getJsonData = () => {
  nodes.value = JSON.parse(JSON.stringify(vueFlowStore.nodes));
  edges.value = JSON.parse(JSON.stringify(vueFlowStore.edges));
};

// NOTE: node add test
const addNode = () => {
  const id = (nodes.value.length + 1).toString();
  nodes.value.push({
    id,
    type: "custom",
    position: { x: 200 * nodes.value.length, y: 0 },
    data: { type: id === "1" ? "input" : "default", label: `Node ${id}` }
  });
};

// NOTE: node reset test
const resetNode = () => {
  nodes.value = [];
  edges.value = [];
};

// NOTE: test the added control button
const onTestButton = () => {
  alert("TEST BUTTON CLICK!");
};

// NOTE: enable node connections
const onConnect = (params: ConnectParams) => {
  addEdges(params);
};
</script>

<template>
  <div class="vue-flow-wrapper">
    <VueFlow
      class="vue-flow"
      fit-view-on-init
      :nodes="nodes"
      :edges="edges"
      :default-viewport="{ zoom: 3 }"
      :min-zoom="0.2"
      :max-zoom="4"
      @connect="onConnect"
    >
      <Background variant="dots" :gap="16" :size="1" pattern-color="#aaa" />
      <Panel class="panel-button-group" position="top-left">
        <button type="button" @click="getJsonData">get json data</button>
        <button type="button" @click="addNode">Add a node</button>
        <button type="button" @click="resetNode">reset node</button>
      </Panel>
      <MiniMap pannable zoomable maskColor="#aaa" />
      <template #node-custom="props">
        <CustomNode :data="props.data" />
      </template>
      <Controls position="top-right">
        <ControlButton title="test button" @click="onTestButton">T</ControlButton>
      </Controls>
    </VueFlow>
  </div>
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
@import "@vue-flow/controls/dist/style.css";

.vue-flow-wrapper {
  height: 100%;
}

/* node custom */
.vue-flow__node {
  @apply w-36 h-10 rounded-full border-2 border-blue-900 flex items-center justify-center text-sm font-medium text-blue-900 !important;
}

.vue-flow__node.selected {
  @apply bg-blue-900 text-white !important;
}

/* handle custom */
.vue-flow__handle {
  @apply w-2 h-2 border-blue-900 border-2 bg-white !important;
}

/* panel custom */
.panel-button-group button {
  @apply text-white bg-blue-900 hover:bg-blue-900/90 focus:ring-4 focus:outline-none focus:ring-blue-900/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-blue-900/55 me-2 mb-2;
}

/* controls custom */
.vue-flow__controls {
  @apply flex;
}
</style>
