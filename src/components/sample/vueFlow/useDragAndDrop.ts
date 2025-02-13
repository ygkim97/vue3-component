import { useVueFlow } from "@vue-flow/core";
import { ref, watch } from "vue";
import { useVueFlowStore } from "@/stores/vueFlow/vueFlow.ts";
import type { CustomNode } from "@/types/vueFlow.ts";

// TODO: 재사용가능하도록 수정하여 /composables 디렉토리로 이동

let id = 0;
const GRID_SIZE = { X: 200, Y: 100 };

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

  const { screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow();
  const { addNode, nodes } = useVueFlowStore();

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? "none" : "";
  });

  const onDragStart = (event: any, type: string | null) => {
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

    // NODE: x, y 좌표를 격자 크기에 맞게 정렬
    const alignedPosition = ["x", "y"].reduce(
      (acc, coordinate) => {
        const gridSize = GRID_SIZE[coordinate.toUpperCase() as keyof typeof GRID_SIZE];
        const value = position[coordinate as keyof typeof position];
        acc[coordinate as "x" | "y"] = Math.round(value / gridSize) * gridSize;
        return acc;
      },
      {} as { x: number; y: number }
    );

    // 놓으려는 위치에 이미 노드가 존재하면 노드 추가 못하도록 처리
    if (getNodeByPosition(alignedPosition)) {
      return;
    }

    const nodeId = getId();
    const newNode: CustomNode = {
      id: nodeId,
      type: "custom",
      position: alignedPosition,
      data: { type: draggedType.value, label: nodeId }
    };

    // NOTE: vue store 에 추가된 node 저장
    addNode(newNode);

    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => {
        // 중심 정렬 및 격자 맞춤 조정
        const adjustedPosition = {
          x: Math.round((node.position.x - node.dimensions.width / 2) / GRID_SIZE.X) * GRID_SIZE.X,
          y: Math.round((node.position.y - node.dimensions.height / 2) / GRID_SIZE.Y) * GRID_SIZE.Y
        };

        return { position: adjustedPosition };
      });

      off();
    });
  };

  const getNodeByPosition = (position: { x: number; y: number }) => {
    return nodes.find((node) => node.position.x === position.x && node.position.y === position.y) || null;
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
