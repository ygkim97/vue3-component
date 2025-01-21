export interface CustomNode {
  id: string; // 노드의 고유 ID
  type: string; // 노드의 타입
  position: { x: number; y: number }; // 노드의 위치 (x, y 좌표)
  data: { type: string | null; label: string }; // 추가 데이터
}

export interface CustomEdge {
  id: string; // 연결 고유 ID
  type: string; // 연결 타입
  source: string; // 연결의 시작 노드 ID
  target: string; // 연결의 끝 노드 ID
  animated?: boolean; // 애니메이션 적용 여부
  data?: object; // 추가 데이터
}
