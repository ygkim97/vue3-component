<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { storeToRefs } from "pinia";
import { VueFlow, Panel, useVueFlow } from "@vue-flow/core";
import type { Connection } from "@vue-flow/core";
import { ControlButton, Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";

import type { CustomNode as CustomNodeType } from "@/types/vueFlow.ts";
import CustomNode from "@/components/sample/vueFlow/customNode.vue";
import CustomEdge from "@/components/sample/vueFlow/customEdge.vue";
import Sidebar from "@/components/sample/vueFlow/sidebar.vue";
import DropzoneBackground from "@/components/sample/vueFlow/dropzoneBackground.vue";
import BottomBanner from "@/components/sample/vueFlow/bottomBanner.vue";
import LabelEditModal from "@/components/sample/vueFlow/labelEditModal.vue";
import useDragAndDrop from "@/components/sample/vueFlow/useDragAndDrop.ts";
import { useVueFlowStore } from "@/stores/vueFlow/vueFlow.ts";
import { useRunProcess } from "@/components/sample/vueFlow/useRunProcess.ts";
import { useScreenshot } from "@/components/sample/vueFlow/useScreenshot.ts";

const {
  getSelectedNodes,
  getConnectedEdges,
  getIntersectingNodes,
  updateNode: setNode,
  getIncomers,
  vueFlowRef,
  addSelectedNodes
} = useVueFlow();
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop();
const vueFlowStore = useVueFlowStore();
const {
  resetAll,
  getJsonData: fetchJsonData,
  addNode,
  updateNode,
  removeNode,
  addEdge,
  removeEdges,
  setRestoredData
} = vueFlowStore;
const { nodes, edges } = storeToRefs(vueFlowStore);
const { run, reset } = useRunProcess();
const { capture } = useScreenshot();

const isOpenBanner = ref<boolean>(false);
const selectedNodeInfo = reactive<{ selectedNode: CustomNodeType | null; connectedNodes: CustomNodeType[][] | null }>({
  selectedNode: null,
  connectedNodes: null
});
const isEditModalOpen = ref<boolean>(false);
const markerSelection = ref<HTMLElement | null>(null);
const isOpenMarkerSelectBox = ref<boolean>(false);
const markerType = ref<string>("plain");
const markerOptions = ["plain", "arrow", "diamond", "circle", "square"];
const isNodeDataOnly = ref<boolean>(false);

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
    addSelectedNodes([]);
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
 * Resets the execution state when the panel button is clicked.
 */
const resetExecution = () => {
  reset();
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
 * - Edit node label and description
 * - Edit edges and handles UI
 */
const onToolbarClick = ({ id }: { id: string }): void => {
  if (selectedNodeInfo.selectedNode === null) {
    console.error("No node is selected.");
  } else {
    if (id === "delete") {
      // node delete
      if (confirm("노드를 삭제하시겠습니까?")) {
        const selectedNodeId = selectedNodeInfo.selectedNode!.id;
        removeNode(selectedNodeId, getConnectedEdges(selectedNodeId));
      }
    } else if (id === "info") {
      // open the node info bottom banner
      isOpenBanner.value = true;
    } else if (id === "edit") {
      // opens the modal to edit the node label and description.
      isEditModalOpen.value = true;
      if (isOpenBanner.value) {
        isOpenBanner.value = false;
      }
    } else if (id === "start" && selectedNodeInfo.selectedNode) {
      // enable edge animations and change the handle color
      run(selectedNodeInfo as { selectedNode: CustomNodeType; connectedNodes: CustomNodeType[][] | null });
    }
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
const nodeDragStop = ({ node }: { node: CustomNodeType }) => {
  const { id, type, data, position } = node;
  const originPosition = nodes.value.find((data) => data.id === id)?.position;

  const intersections = getIntersectingNodes(node);
  const intersectionIds = intersections.map((intersection) => intersection.id);

  const updatedNode = {
    id,
    type,
    position: intersectionIds.length > 0 ? originPosition : position,
    data
  } as CustomNodeType;
  updateNode(updatedNode); // store node update
  setNode(id, updatedNode); // NOTE: Vue Flow 에서 상태 변화를 감지하도록 노드 강제 업데이트
};

const setConnectionNodes = () => {
  // selected Node 에 연결된 nodes path list 가져오는 함수
  const buildConnections = ({
    currentPath = [],
    node,
    connectData,
    cnt
  }: {
    currentPath?: CustomNodeType[];
    node: CustomNodeType;
    connectData: CustomNodeType[][];
    cnt: number;
  }) => {
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

  const connectData: CustomNodeType[][] = [];
  if (selectedNodeInfo.selectedNode && getIncomers(selectedNodeInfo.selectedNode).length > 0) {
    let cnt = 0;
    cnt = buildConnections({ node: selectedNodeInfo.selectedNode, connectData, cnt });
  }

  selectedNodeInfo.connectedNodes = connectData;
};

const nodeClick = () => {
  isOpenBanner.value = false;
};

const markSelectBoxClick = () => {
  isOpenMarkerSelectBox.value = !isOpenMarkerSelectBox.value;
  if (isOpenMarkerSelectBox.value && markerSelection.value) {
    markerSelection.value.focus();
  }
};

/**
 * Manage VueFlow Info Save & Restore Using LocalStorage
 */
const flowKey = "vue-flow--save-restore";
const onSave = () => {
  localStorage.setItem(flowKey, JSON.stringify({ nodes: nodes.value, edges: edges.value }));
  alert("저장되었습니다.");
};

const restoreSavedFlow = () => {
  if (confirm("저장된 데이터를 불러오시겠습니까?")) {
    const savedFlow = localStorage.getItem(flowKey);
    const parsedFlow = savedFlow ? JSON.parse(savedFlow) : null;
    if (parsedFlow) {
      setRestoredData(parsedFlow);
    } else {
      alert("저장된 데이터가 없습니다.");
    }
  }
};

const doScreenshot = () => {
  if (!vueFlowRef.value) {
    console.warn("VueFlow element not found");
    return;
  }

  capture(vueFlowRef.value, { shouldDownload: true, isNodeDataOnly: isNodeDataOnly.value });
};
</script>

<template>
  <div class="vue-flow-wrapper" @drop="onDrop">
    <Sidebar @getJsonData="getJsonData" @createNode="createNode" @resetNode="resetNode" />
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
      <Panel position="top-left" class="panel-box">
        <h3>Panel Box</h3>
        <div class="panel-contents">
          <div
            class="relative w-40 bg-white rounded-md text-xs"
            @focusout="isOpenMarkerSelectBox != isOpenMarkerSelectBox"
          >
            <button
              class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 flex justify-between items-center overflow-hidden h-full"
              @click="markSelectBoxClick"
            >
              <span class="text-gray-500">{{ markerType.toString().toUpperCase() }} MARKER</span>
              <svg-icon :name="isOpenMarkerSelectBox ? 'arrow-up' : 'arrow-down'" class="w-3"></svg-icon>
            </button>
            <div
              class="absolute z-20 w-full"
              ref="markerSelection"
              tabindex="-1"
              @focusout="isOpenMarkerSelectBox = false"
            >
              <ul
                v-show="isOpenMarkerSelectBox"
                class="w-full mt-2 border border-gray-300 rounded-md shadow-lg overflow-hidden z-10 bg-white"
              >
                <li v-for="marker in markerOptions" :key="marker" :class="markerType === marker ? 'bg-gray-100' : ''">
                  <button
                    class="w-full h-full px-4 py-2 text-gray-500 hover:bg-gray-50 cursor-pointer overflow-hidden text-left"
                    @mousedown="[(markerType = marker), (isOpenMarkerSelectBox = !isOpenMarkerSelectBox)]"
                  >
                    {{ marker.toUpperCase() }} MARKER
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <button type="button" @click="resetExecution">Reset Execution</button>
          <div class="flex items-center col-span-2">
            <input
              id="screenshot-only-data"
              type="checkbox"
              v-model="isNodeDataOnly"
              class="w-4 h-4 text-blue-900 bg-gray-100 border-gray-300 rounded-sm dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="screenshot-only-data" class="ms-2 text-sm font-medium text-gray-700"
              >SCREENSHOT ONLY DATA</label
            >
          </div>
        </div>
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
          :marker-type="markerType"
          @removeEdge="removeEdges"
        />
      </template>
      <Controls position="top-right">
        <ControlButton title="save" @click="onSave">
          <svg-icon name="floppy-disk"></svg-icon>
        </ControlButton>
        <ControlButton title="restore" @click="restoreSavedFlow">
          <svg-icon name="file-arrow-down"></svg-icon>
        </ControlButton>
        <ControlButton title="screenshot" @click="doScreenshot">
          <svg-icon name="camera"></svg-icon>
        </ControlButton>
      </Controls>
    </VueFlow>
    <BottomBanner :isOpenBanner="isOpenBanner" :selectedNodeInfo="selectedNodeInfo" @close="closeBanner"></BottomBanner>
  </div>
  <!-- TODO: common modal component -->
  <LabelEditModal
    v-if="isEditModalOpen"
    :data="selectedNodeInfo.selectedNode"
    @close="isEditModalOpen = false"
  ></LabelEditModal>
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
@import "@vue-flow/controls/dist/style.css";
.vue-flow-wrapper {
  @apply h-full flex relative;
}

.vue-flow {
  @apply bg-white;
}
/* Panel Custom */
.panel-box {
  @apply grid text-center p-2 font-bold bg-blue-900 border border-gray-200 rounded-md bg-opacity-20;
}

.panel-contents {
  @apply grid grid-cols-2 gap-2 m-1;
}

.panel-contents > button {
  @apply text-white bg-blue-900 hover:bg-blue-900/90 focus:ring-4 focus:outline-none focus:ring-blue-900/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-blue-900/55;
}

/* Controls Custom */
.vue-flow__controls {
  @apply flex;
}
</style>
