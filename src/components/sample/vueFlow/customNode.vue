<script setup lang="ts">
import { ref } from "vue";
import { Handle, Position } from "@vue-flow/core";

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const nodeType = ref(props.data?.type);
const nodeLabel = ref(props.data?.label);
</script>

<template>
  <Handle v-if="nodeType !== 'output'" type="source" :position="Position.Right" />
  {{ nodeLabel }}
  <Handle v-if="nodeType !== 'input'" type="target" :position="Position.Left" />
</template>
