import { useVueFlow } from "@vue-flow/core";
import { ref, watch } from "vue";
import { useVueFlowStore } from "@/stores/vueFlow/vueFlow.ts";

// TODO: 재사용가능하도록 수정하여 /composables 디렉토리로 이동
// TODO: 드롭 시, 격자에 맞춰 배치되도록 설정

let id = 0;

const getId = (): string => {
  return `Dnd Node ${id++}`;
};

/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 */
const state = {
  /**
   * The type of the node being dragged.
   */
  draggedType: ref<string | null>(null),
  isDragOver: ref<boolean>(false),
  isDragging: ref<boolean>(false)
};

export default function useDragAndDrop() {
  const { draggedType, isDragOver, isDragging } = state;

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow();
  const { addNode } = useVueFlowStore();

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? "none" : "";
  });

  const onDragStart = (event, type) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData("application/vueflow", type);
      event.dataTransfer.effectAllowed = "move";
    }

    draggedType.value = type;
    isDragging.value = true;

    document.addEventListener("drop", onDragEnd);
  };

  /**
   * Handles the drag over event.
   */
  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    if (draggedType.value) {
      isDragOver.value = true;

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    }
  };

  const onDragLeave = () => {
    isDragOver.value = false;
  };

  const onDragEnd = () => {
    isDragging.value = false;
    isDragOver.value = false;
    draggedType.value = null;
    document.removeEventListener("drop", onDragEnd);
  };

  /**
   * Handles the drop event.
   */
  const onDrop = (event: DragEvent) => {
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY
    });

    const nodeId = getId();

    const newNode = {
      id: nodeId,
      type: "custom",
      position,
      data: { type: draggedType.value, label: nodeId }
    };

    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
      }));

      off();
    });

    addNodes(newNode);

    // NOTE: vue store 에 추가된 node 저장
    addNode(newNode);
  };

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop
  };
}
