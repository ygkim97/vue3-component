<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVueFlow } from "@vue-flow/core";

const { getConnectedEdges } = useVueFlow();

const props = defineProps({
  isOpenBanner: {
    type: Boolean,
    default: false
  },
  selectedNodeInfo: {
    type: Object,
    required: false,
    default: () => {}
  }
});

const isOpenSelectBox = ref<boolean>(false);
const selectMenu = ref<HTMLElement | null>(null);
const selectedPathIndex = ref<number>(0);
const selectedPathBtnId = ref<string>("");
const connectionData = ref<{ [key: string]: any } | null>(null);

const contents = computed(() => {
  const { selectedNode, connectedNodes } = props.selectedNodeInfo;
  if (!selectedNode) return {};

  const { id, type, dimensions, position, data } = selectedNode;
  return { selectedNode: { id, type, dimensions, position, data }, connectedNodes };
});

const selectedPath = computed(() => {
  let connectedNodes = [];
  if (contents.value?.connectedNodes) {
    connectedNodes = contents.value?.connectedNodes[selectedPathIndex.value];
  }
  return connectedNodes;
});

watch(
  () => props.isOpenBanner,
  (isOpen: boolean) => {
    if (!isOpen) {
      selectedPathIndex.value = 0;
      selectedPathBtnId.value = "node_0";
    }
  }
);

watch(
  () => selectedPath.value,
  (val) => {
    if (val && val.length > 0) {
      getConnectionData("node", 0);
    }
  }
);

const selectBoxClick = () => {
  isOpenSelectBox.value = !isOpenSelectBox.value;
  if (selectMenu.value && isOpenSelectBox.value) {
    selectMenu.value.focus();
  }
};

const getConnectionData = (connectType: string, nodeIndex: number) => {
  const { id, type, dimensions, position, data } = selectedPath.value[nodeIndex];
  selectedPathBtnId.value = `${connectType}_${nodeIndex}`;
  if (connectType === "node") {
    connectionData.value = { "NODE ID": id, type, dimensions, position, data };
  } else if (connectType === "edge") {
    const { id: nextNodeId } = selectedPath.value[nodeIndex + 1];
    const {
      id: edgeId,
      type: edgeType,
      source,
      target,
      data
    } = getConnectedEdges(id)
      .filter(({ source, target }) => {
        return source === id && target === nextNodeId;
      })
      .shift() || {};

    connectionData.value = { "EDGE ID": edgeId, type: edgeType, source, target, data };
  }
};
</script>

<template>
  <div
    :class="{ 'translate-y-full': !props.isOpenBanner, 'translate-y-0': props.isOpenBanner }"
    tabindex="-1"
    class="bottom-banner"
  >
    <div class="bottom-banner__header">
      <div class="bottom-banner__title">Selected Node Information</div>
      <button @click="$emit('close')" data-dismiss-target="#bottom-banner" type="button" class="close-button">
        <svg-icon name="close"></svg-icon>
      </button>
    </div>
    <div class="bottom-banner__content">
      <div class="description">
        <div class="selected-node-box">
          <h5 class="selected-node__title">Selected Node Data</h5>
          <div class="selected-node__content">
            <!-- TODO: table component -->
            <table>
              <thead></thead>
              <tbody>
                <tr v-for="(data, key) in contents.selectedNode" :key="key">
                  <th scope="row">
                    {{ key.toString().toUpperCase() }}
                  </th>
                  <td>{{ data }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="connection-info-box">
          <div class="flex justify-between">
            <h5 class="connection-info__title">Incoming Connections</h5>

            <!-- TODO: selectebox component -->
            <div class="grid grid-cols-2 gap-2 items-center">
              <h5 class="text-end font-bold">PATH</h5>
              <div class="relative w-64" @focusout="isOpenSelectBox != isOpenSelectBox">
                <button
                  class="w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 text-left focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  :disabled="!selectedPath"
                  :class="selectedPath ? '' : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'"
                  @click="selectBoxClick"
                >
                  <template class="flex justify-between text-gray-500">
                    <span v-if="selectedPath" class="text-gray-500">PATH {{ selectedPathIndex + 1 }}</span>
                    <span v-else>Path does not exist</span>
                    <svg-icon :name="isOpenSelectBox ? 'arrow-up' : 'arrow-down'" class="w-3"></svg-icon>
                  </template>
                </button>
                <div class="absolute z-20 w-full" ref="selectMenu" tabindex="-1" @focusout="isOpenSelectBox = false">
                  <ul
                    v-show="isOpenSelectBox"
                    class="w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden z-10"
                  >
                    <li v-for="(_, index) in contents.connectedNodes" :key="`path_${index}`">
                      <button
                        class="w-full h-full px-4 py-2 text-gray-500 hover:bg-gray-50 cursor-pointer overflow-hidden text-left"
                        @mousedown="[(selectedPathIndex = index), (isOpenSelectBox = !isOpenSelectBox)]"
                      >
                        PATH {{ index + 1 }}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="connection-info__content">
            <ol class="grid my-auto" :class="selectedPath ? `grid-cols-${selectedPath.length}` : ''">
              <li
                v-for="(_, index) in selectedPath"
                :key="index"
                class="grid justify-center items-center grid-cols-[auto,1fr]"
                style="transform: translateX(50%)"
              >
                <button
                  @click="getConnectionData('node', index)"
                  class="w-5 h-5 bg-gray-300 border-2 border-transparent rounded-full flex hover:bg-gray-500"
                  :class="selectedPathBtnId === `node_${index}` ? 'bg-gray-600' : ''"
                ></button>
                <div
                  v-if="selectedPath.length !== index + 1"
                  class="w-full h-full cursor-pointer flex items-center group"
                  @click="getConnectionData('edge', index)"
                >
                  <span
                    class="w-full h-0.5 bg-gray-300 group-hover:bg-gray-500"
                    :class="selectedPathBtnId === `edge_${index}` ? 'bg-gray-600' : ''"
                  ></span>
                </div>
              </li>
            </ol>
            <div>
              <table v-if="selectedPath">
                <colgroup>
                  <col class="w-1/4" />
                  <col class="w-3/4" />
                </colgroup>
                <thead></thead>
                <tbody>
                  <tr v-for="(data, key) in connectionData" :key="key">
                    <th scope="row">
                      {{ key.toString().toUpperCase() }}
                    </th>
                    <td>{{ data }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="no-data">데이터가 없습니다.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottom-banner {
  @apply fixed w-full h-80 bottom-0 start-0 z-50 grid p-4 border-t border-gray-200 bg-gray-50 shadow-inner grid-rows-[auto,1fr] transition-transform duration-300;
}

.bottom-banner__header {
  @apply flex justify-between;
}

.bottom-banner__title {
  @apply text-2xl text-slate-500;
}

.close-button {
  @apply w-7 h-7 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white flex justify-center items-center;
}

.close-button img {
  @apply w-3 h-3;
}

.bottom-banner__content {
  @apply flex flex-col justify-center items-center text-2xl text-slate-500;
}

.description {
  @apply text-sm grid gap-10 grid-cols-[1fr,2fr];
}

.selected-node-box {
  @apply min-h-[240px] max-h-[240px] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-600 dark:border-gray-500;
}

.selected-node__title {
  @apply mb-2 text-2xl font-bold tracking-tight dark:text-white;
}

.selected-node__content {
  @apply relative overflow-x-auto overflow-y-scroll h-[85%];
}

.bottom-banner table {
  @apply w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 h-full;
}

.bottom-banner table tr {
  @apply bg-white border-b dark:bg-gray-800 dark:border-gray-700;
}

.bottom-banner table th {
  @apply px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white;
}

.bottom-banner table td {
  @apply px-6 py-2;
}

.connection-info-box {
  @apply min-h-[240px] max-h-[240px] p-6;
}

.connection-info__title {
  @apply mb-2 text-2xl font-bold tracking-tight;
}

.connection-info__content {
  @apply w-full h-[90%] grid grid-rows-[1fr,3fr];
}

.connection-info__content > div {
  @apply overflow-y-scroll shadow-md rounded-md;
}

.connection-info__content table {
  @apply bg-white;
}

.connection-info__content table tr {
  @apply bg-white border-b border-gray-200;
}

.connection-info__content table th {
  @apply px-6 font-medium text-gray-500 whitespace-nowrap;
}

.no-data {
  @apply h-full w-full flex justify-center items-center bg-white;
}

::-webkit-scrollbar {
  @apply w-2 h-2;
}

::-webkit-scrollbar-track {
  @apply bg-gray-700 rounded-sm;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-500 rounded-md;
}

.connection-info__content ::-webkit-scrollbar-track {
  @apply bg-gray-200;
}

.connection-info__content ::-webkit-scrollbar-thumb {
  @apply bg-gray-300;
}
</style>
