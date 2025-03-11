/**
 * 아키텍처 워커 관리자
 *
 * 이 모듈은 웹 워커를 생성하고 관리하며, 워커와 메시지를 주고받는 인터페이스를 제공합니다.
 * UI 아키텍처 생성 요청을 워커에 전달하고 결과를 받아 처리합니다.
 */

import { DOMBluePrint } from "@/types";

// 타입 정의
export interface ArchitectureRequest {
  id: string;
  blueprint: DOMBluePrint;
  timestamp: number;
}

export interface ArchitectureResponse {
  code: string;
  components: any[];
  metadata: any;
}

export interface ProgressInfo {
  status: string;
  message: string;
  progress: number;
}

export type ArchitectureCallback = (response: ArchitectureResponse) => void;
export type ErrorCallback = (error: any) => void;
export type ProgressCallback = (progress: ProgressInfo) => void;

interface RequestCallbacks {
  onSuccess?: ArchitectureCallback;
  onError?: ErrorCallback;
  onProgress?: ProgressCallback;
}

interface PendingRequest extends RequestCallbacks {
  id: string;
  blueprint: DOMBluePrint;
}

// 워커 관리
export let worker: Worker | null = null;
const pendingRequests = new Map<string, PendingRequest>();

/**
 * 워커 초기화
 * 필요할 때 워커를 생성하고 이벤트 리스너를 설정합니다.
 */
export function initWorker() {
  if (worker) return;

  try {
    // 워커 생성
    worker = new Worker(new URL("./architectureWorker.ts", import.meta.url), {
      type: "module",
    });

    // 워커 메시지 이벤트 리스너
    worker.addEventListener("message", handleWorkerMessage);

    // 워커 에러 이벤트 리스너
    worker.addEventListener("error", (event) => {
      console.error("Worker error:", event);
    });

    console.log("Architecture worker initialized");
  } catch (error) {
    console.error("Failed to initialize worker:", error);
    worker = null;
  }
}

/**
 * 워커 메시지 핸들러
 * 워커로부터 받은 메시지를 처리합니다.
 */
function handleWorkerMessage(event: MessageEvent) {
  const { type, requestId, payload } = event.data;
  const request = pendingRequests.get(requestId);
  if (!request) {
    console.warn(`No pending request found for ID: ${requestId}`);
    return;
  }

  switch (type) {
    case "RESULT":
      if (request.onSuccess) {
        console.log(payload);
        request.onSuccess(payload as ArchitectureResponse);
      }
      pendingRequests.delete(requestId);
      break;

    case "ERROR":
      if (request.onError) {
        request.onError(payload);
      }
      pendingRequests.delete(requestId);
      break;

    case "PROGRESS":
      if (request.onProgress) {
        request.onProgress(payload as ProgressInfo);
      }
      break;

    default:
      console.warn(`Unknown message type from worker: ${type}`);
  }
}

/**
 * 아키텍처 코드 생성 요청
 *
 * @param blueprint - 아키텍처 청사진 데이터
 * @param callbacks - 콜백 함수 객체 (성공, 에러, 진행 상태)
 * @returns 요청 ID (취소에 사용 가능)
 */
export function generateArchitectureCode(
  blueprint: DOMBluePrint,
  callbacks: RequestCallbacks = {}
): string {
  // 워커 초기화
  initWorker();

  if (!worker) {
    if (callbacks.onError) {
      callbacks.onError(new Error("워커를 초기화할 수 없습니다."));
    }
    return "";
  }

  // 요청 ID 생성
  const requestId = blueprint.id;
  // 요청 정보 저장
  pendingRequests.set(requestId, {
    id: requestId,
    blueprint,
    ...callbacks,
  });

  // 워커에 요청 전송
  worker.postMessage({
    type: "ADD_REQUEST",
    payload: {
      id: requestId,
      blueprint,
      timestamp: Date.now(),
    },
  });

  return requestId;
}

/**
 * 아키텍처 코드 생성 요청 취소
 *
 * @param requestId - 취소할 요청의 ID
 * @returns 취소 성공 여부
 */
export function cancelArchitectureCodeGeneration(requestId: string): boolean {
  if (!worker || !pendingRequests.has(requestId)) {
    return false;
  }

  // 워커에 취소 요청 전송
  worker.postMessage({
    type: "CANCEL_REQUEST",
    payload: requestId,
  });

  // 대기 중인 요청에서 제거
  pendingRequests.delete(requestId);

  return true;
}

/**
 * 워커 종료
 * 애플리케이션 종료 시 호출하여 워커를 정리합니다.
 */
export function terminateWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
    pendingRequests.clear();
    console.log("Architecture worker terminated");
  }
}

// 페이지 언로드 시 워커 종료
window.addEventListener("beforeunload", () => {
  terminateWorker();
});
