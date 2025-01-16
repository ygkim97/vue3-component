import { ref } from "vue";
import { defineStore } from "pinia";
import flowData from "./vueFlow.json";

export const useVueFlowStore = defineStore("vueFlow", () => {
  const nodes = ref<Node[]>(flowData.nodes);
  const edges = ref<Edge[]>(flowData.edges);

  return { nodes, edges };
});
