import { reactive, computed } from "vue";
import { defineStore } from "pinia";
import defaultSampleData from "@/stores/vueFlow/sampleData/default.json";
import connectionSampleData from "@/stores/vueFlow/sampleData/connection.json";
import type { CustomNode, CustomEdge } from "@/types/vueFlow.ts";

export const useVueFlowStore = defineStore("vueFlow", () => {
  const nodes = reactive<CustomNode[]>([]);
  const edges = reactive<CustomEdge[]>([]);

  const nodeObjByKey = computed(() => {
    return nodes.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
  });

  const resetAll = () => {
    nodes.length = 0;
    edges.length = 0;
  };

  const getJsonData = (action: string) => {
    resetAll();

    const sampleData = action === "default" ? defaultSampleData : connectionSampleData;
    nodes.push(...sampleData.nodes);
    edges.push(...sampleData.edges);
  };

  const addNode = (node: CustomNode) => {
    nodes.push(node);
  };

  const updateNode = (updatedNode: CustomNode) => {
    const nodeIndex = nodes.findIndex((node) => node.id === updatedNode.id);
    if (nodeIndex !== -1) {
      nodes[nodeIndex] = { ...nodes[nodeIndex], ...updatedNode };
    }
  };

  const removeNode = (nodeId, connectedEdges) => {
    nodes.splice(0, nodes.length, ...nodes.filter(({ id }) => id !== nodeId));

    // NOTE: 노드와 연결되어 있는 엣지 제거
    const connectedEdgeIds = connectedEdges.map(({ id }) => id);
    removeEdges(connectedEdgeIds);
  };

  const addEdge = (edge: CustomEdge) => {
    edges.push(edge);
  };

  const removeEdges = (removeIds: string | string[]) => {
    const idsToRemove = Array.isArray(removeIds) ? removeIds : [removeIds];
    edges.splice(0, edges.length, ...edges.filter(({ id }) => !idsToRemove.includes(id)));
  };

  const setRestoredData = ({ nodes: restoreNodes, edges: restoreEdges }) => {
    nodes.splice(0, nodes.length, ...restoreNodes);
    edges.splice(0, edges.length, ...restoreEdges);
  };

  return {
    nodes,
    edges,
    getJsonData,
    resetAll,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    removeEdges,
    setRestoredData,
    nodeObjByKey
  };
});
