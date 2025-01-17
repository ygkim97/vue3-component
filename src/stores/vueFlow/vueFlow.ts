import { reactive } from "vue";
import { defineStore } from "pinia";
import flowData from "./vueFlow.json";

export const useVueFlowStore = defineStore("vueFlow", () => {
  const nodes = reactive<Node[]>([]);
  const edges = reactive<Edge[]>([]);

  const resetAll = () => {
    nodes.length = 0;
    edges.length = 0;
  };

  const getJsonData = () => {
    resetAll();

    nodes.push(...flowData.nodes);
    edges.push(...flowData.edges);
  };

  const addNode = (node: Node) => {
    nodes.push(node);
  };

  const addEdge = (edge: Edge) => {
    edges.push(edge);
  };

  return { nodes, edges, getJsonData, resetAll, addNode, addEdge };
});
