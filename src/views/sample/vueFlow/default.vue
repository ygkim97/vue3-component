<script setup>
import { ref } from "vue";
import { VueFlow, useVueFlow, MarkerType } from "@vue-flow/core";

const nodes = ref([
  {
    id: "test1",
    type: "input",
    position: { x: 100, y: 100 },
    data: { label: "Start" },
    style: { backgroundColor: "lightPink" },
    class: "input-node",
    draggable: true,
    resizable: false
  },
  {
    id: "test2",
    type: "default",
    position: { x: 400, y: 100 },
    data: { label: "Process" },
    style: { backgroundColor: "lightblue" },
    class: "default-node",
    draggable: false,
    resizable: false
  }
]);

const edges = ref([
  {
    id: "e1-2",
    type: "step",
    source: "test1",
    target: "test2",
    data: { description: "edgeData" },
    label: "EdgeLabel",
    labelStyle: { fill: "red" },
    labelBgStyle: { fill: "#FFCC00" },
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    style: { stroke: "gray" },
    animated: true,
    markerStart: MarkerType.Arrow,
    markerEnd: MarkerType.ArrowClosed
  }
]);
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges" />
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

.input-node {
  border: solid 2px red !important;
}

.default-node {
  border: solid 2px blue !important;
}
</style>
