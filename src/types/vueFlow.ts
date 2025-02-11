import type { Ref } from "vue";
import type { Options as HTMLToImageOptions } from "html-to-image/es/types";

export interface CustomNode {
  id: string; // 노드의 고유 ID
  type: string; // 노드의 타입
  position: { x: number; y: number }; // 노드의 위치 (x, y 좌표)
  data: { type: string | null; label: string; description?: string }; // 추가 데이터
}

export interface CustomEdge {
  id: string; // 연결 고유 ID
  type: string; // 연결 타입
  source: string; // 연결의 시작 노드 ID
  target: string; // 연결의 끝 노드 ID
  animated?: boolean; // 애니메이션 적용 여부
  data?: object; // 추가 데이터
}

export type ImageType = "jpeg" | "png";

export interface UseScreenshotOptions extends HTMLToImageOptions {
  type?: ImageType;
  fileName?: string;
  shouldDownload?: boolean;
  fetchRequestInit?: RequestInit;
  isNodeDataOnly?: boolean;
}

export type CaptureScreenshot = (el: HTMLElement, options?: UseScreenshotOptions) => Promise<object>;

export type Download = (fileName: string) => void;

export interface UseScreenshot {
  // returns the data url of the screenshot
  capture: CaptureScreenshot;
  download?: Download;
  dataUrl?: Ref<string>;
  error?: Ref;
}
