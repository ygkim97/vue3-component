<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { storeToRefs } from "pinia";
import { VueFlow, Panel, useVueFlow } from "@vue-flow/core";
import type { Connection } from "@vue-flow/core";
import { ControlButton, Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";

import CustomNode from "@/components/sample/vueFlow/customNode.vue";
import CustomEdge from "@/components/sample/vueFlow/customEdge.vue";
import Sidebar from "@/components/sample/vueFlow/sidebar.vue";
import DropzoneBackground from "@/components/sample/vueFlow/dropzoneBackground.vue";
import BottomBanner from "@/components/sample/vueFlow/bottomBanner.vue";
import useDragAndDrop from "@/components/sample/vueFlow/dragAndDrop.ts";
import { useVueFlowStore } from "@/stores/vueFlow/vueFlow.ts";

const { getSelectedNodes, getConnectedEdges, getIntersectingNodes, updateNode: setNode, getIncomers } = useVueFlow();
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop();
const vueFlowStore = useVueFlowStore();
const { resetAll, getJsonData: fetchJsonData, addNode, updateNode, removeNode, addEdge, removeEdges } = vueFlowStore;
const { nodes, edges } = storeToRefs(vueFlowStore);

const isOpenBanner = ref<boolean>(false);
const selectedNodeInfo = reactive<{ [key: string]: object | null }>({
  selectedNode: null,
  connectedNodes: null
});
const markerType = ref<string>("");

watch(getSelectedNodes, ([node]) => {
  selectedNodeInfo.selectedNode = node || null;

  if (node) {
    setConnectionNodes();
  } else {
    closeBanner();
  }
});

/**
 * Test if the JSON data is being rendered correctly
 */
const getJsonData = (action: string) => {
  if (confirm("기존 노드가 초기화됩니다. 계속 진행하시겠습니까?")) {
    fetchJsonData(action);
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
 * TTest marker changes
 */
let currentMarkerIndex = 0;
const onChangeMarker = () => {
  const markerOptions = ["", "arrow", "diamond", "circle", "square"];
  currentMarkerIndex = (currentMarkerIndex + 1) % markerOptions.length;
  markerType.value = markerOptions[currentMarkerIndex];
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
const onToolbarClick = ({ id }: { id: string }): void => {
  // TODO: id 값에 따라 action 처리
  // delete: node delete, info: open the node info modal, edit: node label edit, start: enable edge animations and change the handle color.

  if (id === "delete") {
    if (confirm("노드를 삭제하시겠습니까?")) {
      const selectedNodeId = selectedNode.value.id;
      removeNode(selectedNodeId, getConnectedEdges(selectedNodeId));
    }
  } else if (id === "info") {
    isOpenBanner.value = true;
  } else {
    alert("TOOLBAR CLICK! ACTION = " + id);
  }
};

/**
 * Bottom Banner Close
 */
const closeBanner = () => {
  isOpenBanner.value = false;
};

/**
 * Node Update
 */
const nodeDragStop = ({ node }) => {
  const { id, type, data, position } = node;
  const originPosition = nodes.value.find((data) => data.id === id)?.position;

  const intersections = getIntersectingNodes(node);
  const intersectionIds = intersections.map((intersection) => intersection.id);

  const updatedNode = { id, type, position: intersectionIds.length > 0 ? originPosition : position, data };
  updateNode(updatedNode); // store node update
  setNode(id, updatedNode); // NOTE: Vue Flow 에서 상태 변화를 감지하도록 노드 강제 업데이트
};

const setConnectionNodes = () => {
  // selected Node 에 연결된 nodes path list 가져오는 함수
  const buildConnections = ({ currentPath = [], node, connectData, cnt }) => {
    if (cnt === 0 && !connectData[0]) {
      currentPath = [node];
      connectData[cnt] = [node];
    }

    const incomingNodes = getIncomers(node.id);
    incomingNodes.forEach((incomingNode, index) => {
      if (index === 0) {
        connectData[cnt].unshift(incomingNode);
      } else {
        connectData[++cnt] = [incomingNode, ...currentPath];
      }
      if (getIncomers(incomingNode.id).length > 0) {
        cnt = buildConnections({ currentPath: [...connectData[cnt]], node: incomingNode, connectData, cnt });
      }
    });
    return cnt;
  };

  const connectData = [];
  if (getIncomers(selectedNodeInfo.selectedNode).length > 0) {
    let cnt = 0;
    cnt = buildConnections({ node: selectedNodeInfo.selectedNode, connectData, cnt });
  }

  selectedNodeInfo.connectedNodes = connectData;
};

const nodeClick = () => {
  isOpenBanner.value = false;
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
      @nodeDragStop="nodeDragStop"
      @nodeClick="nodeClick"
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
        <button type="button" @click="onChangeMarker">Marker Change</button>
      </Panel>
      <!-- TODO: warm console log -->
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
          :marker-type="markerType"
          @removeEdge="removeEdges"
        />
      </template>
      <Controls position="top-right">
        <ControlButton title="test button" @click="onControlButton">T</ControlButton>
      </Controls>
    </VueFlow>
    <BottomBanner :isOpenBanner="isOpenBanner" :selectedNodeInfo="selectedNodeInfo" @close="closeBanner"></BottomBanner>
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
