<script setup lang="ts">
import { defineEmits, onMounted, ref } from "vue";
import { useVueFlowStore } from "@/stores/vueFlow/vueFlow.ts";
import { useVueFlow } from "@vue-flow/core";
const vueFlowStore = useVueFlowStore();

const { updateNodeData } = useVueFlow();
const { updateNode } = vueFlowStore;

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const nodeLabel = ref<string>("");
const nodeDesc = ref<string>("");

const close = () => {
  emit("close");
};

const change = () => {
  if (confirm("변경된 내용이 저장됩니다. 계속하시겠습니까?")) {
    const { id, type, position, data } = props.data;
    const changeData = { ...data, label: nodeLabel.value, description: nodeDesc.value };
    const updatedNode = {
      id,
      type,
      position,
      data: changeData
    };
    updateNode(updatedNode);
    updateNodeData(id, changeData); // NOTE: Vue Flow 에서 상태 변화를 감지하도록 노드 강제 업데이트
    close();
  }
};

onMounted(() => {
  const { label, description } = props.data.data;
  nodeLabel.value = label;
  nodeDesc.value = description;
});
</script>
<template>
  <div class="modal-overlay" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="modal-backdrop" aria-hidden="true"></div>

    <div class="modal-container">
      <div class="modal-wrapper">
        <div class="modal-content">
          <div class="modal-body">
            <div class="modal-header">
              <h3 id="modal-title">Update Node Details</h3>
              <button class="close-btn" @click="close">
                <svg-icon name="close" class="close-icon"></svg-icon>
              </button>
            </div>
            <div class="input-group">
              <label for="label">Label</label>
              <input type="text" id="label" placeholder="label" v-model="nodeLabel" />
            </div>
            <div class="input-group">
              <label for="description">Description</label>
              <textarea id="description" placeholder="description" v-model="nodeDesc"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="confirm-btn" @click="change">Change</button>
            <button class="cancel-btn" @click="close">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  @apply relative z-10;
}

.modal-backdrop {
  @apply fixed inset-0 bg-gray-500/75 transition-opacity;
}

.modal-container {
  @apply fixed inset-0 z-10 w-screen overflow-y-auto;
}

.modal-wrapper {
  @apply flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0;
}

.modal-content {
  @apply relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg;
}

.modal-body {
  @apply bg-white px-4 pt-5 pb-4;
}

.modal-header {
  @apply flex justify-between text-center w-full text-base font-semibold text-gray-900;
}

.close-btn {
  @apply p-1;
}

.close-icon {
  @apply w-3;
}

.input-group {
  @apply mt-6 grid gap-2;
}

.input-group label {
  @apply text-start font-bold text-gray-600;
}

.input-group input,
.input-group textarea {
  @apply block min-w-0 grow py-1.5 px-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm border resize-none;
}

.input-group textarea {
  @apply h-28;
}

.modal-footer {
  @apply bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6;
}

.confirm-btn {
  @apply inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto;
}

.cancel-btn {
  @apply mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-sm ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto;
}
</style>
