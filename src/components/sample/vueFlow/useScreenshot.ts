import { ref } from "vue";
import { toJpeg as ElToJpg, toPng as ElToPng } from "html-to-image";
import type { Options as HTMLToImageOptions } from "html-to-image/es/types";
import type { ImageType, UseScreenshot, UseScreenshotOptions } from "@/types/vueFlow.ts";

export function useScreenshot(): UseScreenshot {
  const dataUrl = ref<string>("");
  const imgType = ref<ImageType>("png");
  const error = ref();

  const capture = async (el: HTMLElement, options: UseScreenshotOptions = {}) => {
    let data = {};

    const fileName = options.fileName ?? `vue-flow-screenshot-${Date.now()}`;

    let downloadEl = el;
    // panel 등 제외하고 오직 node data 만 image 로 가져오기
    if (options.isNodeDataOnly) {
      downloadEl = el.querySelector(".vue-flow__viewport") as HTMLElement;
      downloadEl.style.backgroundColor = "white";
    }

    switch (options.type) {
      case "jpeg":
        data = await toJpeg(downloadEl, options);
        break;
      case "png":
        data = await toPng(downloadEl, options);
        break;
      default:
        data = await toPng(downloadEl, options);
        break;
    }

    if (options.shouldDownload && fileName !== "") {
      download(fileName);
    }

    return data;
  };

  const toJpeg = (el: HTMLElement, options: HTMLToImageOptions = { quality: 0.95 }) => {
    error.value = null;

    return ElToJpg(el, options)
      .then((data) => {
        dataUrl.value = data;
        imgType.value = "jpeg";
        return data;
      })
      .catch((error) => {
        error.value = error;
        throw new Error(error);
      });
  };

  const toPng = (el: HTMLElement, options: HTMLToImageOptions = { quality: 0.95 }) => {
    error.value = null;

    return ElToPng(el, options)
      .then((data) => {
        dataUrl.value = data;
        imgType.value = "png";
        return data;
      })
      .catch((error) => {
        error.value = error;
        throw new Error(error);
      });
  };

  const download = (fileName: string) => {
    const link = document.createElement("a");
    link.download = `${fileName}.${imgType.value}`;
    link.href = dataUrl.value;
    link.click();
  };

  return {
    capture,
    download,
    dataUrl,
    error
  };
}
