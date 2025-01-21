import { reactive } from "vue";
import { defineStore } from "pinia";
import flowData from "./vueFlow.json";
import type { CustomNode, CustomEdge } from "@/types/vueFlow.ts";

export const useVueFlowStore = defineStore("vueFlow", () => {
  const nodes = reactive<CustomNode[]>([]);
  const edges = reactive<CustomEdge[]>([]);

  const resetAll = () => {
    nodes.length = 0;
    edges.length = 0;
  };

  const getJsonData = () => {
    resetAll();

    nodes.push(...flowData.nodes);
    edges.push(...flowData.edges);
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

  const addEdge = (edge: CustomEdge) => {
    edges.push(edge);
  };

  const removeEdge = (removeId: string) => {
    const updatedEdges = edges.filter(({ id }) => id !== removeId);
    edges.splice(0, edges.length, ...updatedEdges);
  };

  return { nodes, edges, getJsonData, resetAll, addNode, updateNode, addEdge, removeEdge };
});
