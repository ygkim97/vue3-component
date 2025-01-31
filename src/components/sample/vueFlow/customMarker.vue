<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  stroke: {
    type: String,
    required: false,
    default: "#b1b1b7"
  },
  fill: {
    type: String,
    required: false,
    default: "#b1b1b7"
  },
  strokeWidth: {
    type: Number,
    required: false,
    default: 2
  },
  width: {
    type: Number,
    required: false,
    default: 12.5
  },
  height: {
    type: Number,
    required: false,
    default: 12.5
  }
});
</script>

<template>
  <defs>
    <marker
      :id="id"
      class="vue-flow__arrowhead"
      viewBox="-10 -10 20 20"
      refX="5"
      refY="0"
      :markerWidth="width"
      :markerHeight="height"
      markerUnits="strokeWidth"
      orient="auto-start-reverse"
    >
      <path v-if="type === 'arrow'" d="M-2,-5 L8,0 L-2,5 Z" :fill="fill" />
      <path
        v-if="type === 'diamond'"
        :style="{
          stroke,
          strokeWidth
        }"
        stroke-linecap="round"
        stroke-linejoin="round"
        :fill="fill"
        d="M 0,-5 L 5,0 L 0,5 L -5,0 Z"
      />

      <path
        v-if="type === 'circle'"
        :style="{
          stroke,
          strokeWidth
        }"
        stroke-linecap="round"
        stroke-linejoin="round"
        :fill="fill"
        d="M 0,-4 a 4,4 0 1,0 0,8 a 4,4 0 1,0 0,-8"
      />

      <path
        v-if="type === 'square'"
        :style="{
          stroke,
          strokeWidth
        }"
        stroke-linecap="round"
        stroke-linejoin="round"
        :fill="fill"
        d="M -4 -4 H 4 V 4 H -4 Z"
      />
    </marker>
  </defs>
</template>
