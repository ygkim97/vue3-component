export interface Node {
  id: string; // 노드의 고유 ID
  type: string; // 노드의 타입
  position: { x: number; y: number }; // 노드의 위치 (x, y 좌표)
  data: { label: string }; // 추가 데이터
}

export interface Edge {
  id: string; // 연결 고유 ID
  source: string; // 연결의 시작 노드 ID
  target: string; // 연결의 끝 노드 ID
  animated?: boolean; // 애니메이션 적용 여부
  data?: object; // 추가 데이터
}

export interface ConnectParams {
  source: string | null; // 연결의 시작 노드 ID
  sourceHandle: string | null; // 시작 노드의 핸들 ID
  target: string | null; // 연결의 끝 노드 ID
  targetHandle: string | null; // 끝 노드의 핸들 ID
}
