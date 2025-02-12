import { watch, reactive } from "vue";
import { useVueFlow } from "@vue-flow/core";
import { ProcessStatus } from "@/constants/vueFlow.ts";
import type { CustomNode, CustomEdge } from "@/types/vueFlow.ts";

export function useRunProcess() {
  const { updateNodeData, getConnectedEdges } = useVueFlow();

  const nodeStatusById = reactive<{ [key: string]: string }>({});
  const connectEdgeObjById = reactive<Record<string, CustomEdge[]>>({});
  let uniqueValues: string[] = [];
  let executedNodeIds: string[] = [];
  let selectedNodeId: string | null = null;

  const run = async ({
    selectedNode,
    connectedNodes
  }: {
    selectedNode: CustomNode;
    connectedNodes: CustomNode[][] | null;
  }) => {
    // reset edge and node status
    await reset();

    // path 별 nodeId group setting
    selectedNodeId = selectedNode.id;
    const connectedNodeIds =
      connectedNodes === null || connectedNodes.length === 0
        ? [[selectedNodeId]] // 앞으로 연결된 node 가 없는 경우, 임의로 설정해준다
        : connectedNodes.map((nodeGroup) => {
            return nodeGroup.map((node) => node.id);
          });

    // 실행해야되는 nodeId 값 배열로 셋팅(중복제거)
    uniqueValues = [...new Set(Object.values(connectedNodeIds).flat())];

    // nodeId 를 key 값으로 input 에 연결된 edgeData setting 및 animated 적용
    connectedNodeIds.forEach((nodeIds) => {
      nodeIds.forEach((nodeId) => {
        const edgeData = getConnectedEdges(nodeId).filter((edge) => edge.target === nodeId);
        connectEdgeObjById[nodeId] = edgeData;

        // 연결된 전체 엣지 animate 적용
        if (edgeData.length > 0) {
          edgeData.forEach((edge) => {
            edge.animated = true;
          });
        }
      });
    });

    // 제일 첫번째 depth 에 있는 node 먼저 실행
    uniqueValues.forEach((nodeId) => {
      if (connectEdgeObjById[nodeId].length === 0) {
        setStatus(nodeId);
      }
    });
  };

  watch(
    () => nodeStatusById,
    (nodeIds) => {
      if (executedNodeIds.length === 0) return;
      const lastUpdateNodeId = executedNodeIds[executedNodeIds.length - 1];

      getConnectedEdges(lastUpdateNodeId)
        .filter((data) => {
          return data.source === lastUpdateNodeId && uniqueValues.includes(data.target);
        })
        .forEach((edge) => {
          const nodeId = edge.target;
          let isFail = false;
          const needUpdateStatus =
            connectEdgeObjById[nodeId] &&
            connectEdgeObjById[nodeId].every(({ source }) => {
              if (nodeIds[source] && nodeIds[source] === ProcessStatus.ERROR) isFail = true;
              return nodeIds[source] && nodeIds[source] === ProcessStatus.SUCCESS;
            });

          if (needUpdateStatus) {
            setStatus(nodeId);
          }
          if (isFail) updateNodeStatus(nodeId, ProcessStatus.FAIL);
        });
    },
    { deep: true }
  );

  const reset = async () => {
    uniqueValues.forEach((nodeId) => {
      updateNodeStatus(nodeId, null);
    });
    for (const nodeId in connectEdgeObjById) {
      if (connectEdgeObjById[nodeId].length > 0) {
        connectEdgeObjById[nodeId].forEach((edge) => {
          edge.animated = false;
        });
      }
    }
    Object.keys(nodeStatusById).forEach((key) => {
      delete nodeStatusById[key];
    });
    executedNodeIds = [];
  };

  const getStatus = () => {
    return Math.random() < 0.8 ? ProcessStatus.SUCCESS : ProcessStatus.ERROR;
  };

  const setStatus = (nodeId: string) => {
    updateNodeStatus(nodeId, ProcessStatus.RUNNING);

    setTimeout(
      () => {
        const status = getStatus();
        updateNodeStatus(nodeId, status);
        nodeStatusById[nodeId] = status;
        executedNodeIds.push(nodeId);
      },
      (Math.floor(Math.random() * 5) + 1) * 1000 // 1000 ~ 5000
    );
  };

  const updateNodeStatus = (nodeId: string, status: string | null) => {
    updateNodeData(nodeId, { status });

    if (selectedNodeId === nodeId && status === ProcessStatus.SUCCESS) alert("모든 실행 완료!");
    if (status === ProcessStatus.ERROR) alert(nodeId + " 노드 실행 에러!");
  };

  return { run, reset };
}
