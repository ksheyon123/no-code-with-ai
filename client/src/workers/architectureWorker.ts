/**
 * 아키텍처 생성 요청을 처리하는 웹 워커
 *
 * 이 워커는 UI 아키텍처 생성 요청을 큐에 넣고 순차적으로 처리합니다.
 * 메인 스레드가 차단되지 않도록 별도의 스레드에서 작업을 수행합니다.
 */

import { sendArchitecture } from "@/apis/api";
import { post } from "../apis/https";

// 타입 정의
interface ArchitectureRequest {
  id: string;
  blueprint: any; // 아키텍처 청사진 데이터
  timestamp: number;
}

interface WorkerMessage {
  type: "ADD_REQUEST" | "CANCEL_REQUEST";
  payload: any;
}

interface WorkerResponse {
  type: "RESULT" | "ERROR" | "PROGRESS";
  requestId: string;
  payload: any;
}

// 서버 엔드포인트 (실제 엔드포인트로 변경 필요)
const API_ENDPOINT = "/api/generate-code";

// 요청 큐
let requestQueue: ArchitectureRequest[] = [];
let isProcessing = false;

/**
 * 요청 큐에서 다음 요청을 처리합니다.
 */
async function processNextRequest() {
  if (requestQueue.length === 0 || isProcessing) {
    return;
  }

  isProcessing = true;
  const request = requestQueue[0];
  try {
    // 진행 상태 알림
    self.postMessage({
      type: "PROGRESS",
      requestId: request.id,
      payload: {
        status: "processing",
        message: "코드 생성 중...",
        progress: 0,
      },
    } as WorkerResponse);

    // 서버에 요청 전송
    const response = await sendArchitecture(request.blueprint);
    console.log(response);
    // 결과 전송
    self.postMessage({
      type: "RESULT",
      requestId: request.id,
      payload: response.data,
    } as WorkerResponse);
  } catch (error) {
    // 에러 전송
    self.postMessage({
      type: "ERROR",
      requestId: request.id,
      payload: {
        message:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
        error,
      },
    } as WorkerResponse);
  } finally {
    // 처리 완료된 요청 제거
    requestQueue.shift();
    isProcessing = false;

    // 다음 요청이 있으면 처리
    if (requestQueue.length > 0) {
      processNextRequest();
    }
  }
}

/**
 * 새 요청을 큐에 추가합니다.
 */
function addRequest(request: ArchitectureRequest) {
  requestQueue.push(request);

  // 처리 중이 아니면 처리 시작
  if (!isProcessing) {
    processNextRequest();
  }
}

/**
 * 특정 ID의 요청을 취소합니다.
 */
function cancelRequest(requestId: string) {
  // 처리 중인 첫 번째 요청이 취소 대상이면 다음 요청으로 넘어감
  if (requestQueue.length > 0 && requestQueue[0].id === requestId) {
    requestQueue.shift();
    isProcessing = false;
    processNextRequest();
  } else {
    // 큐에서 해당 ID의 요청 제거
    requestQueue = requestQueue.filter((req) => req.id !== requestId);
  }
}

/**
 * 메시지 이벤트 리스너
 */
self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;
  switch (type) {
    case "ADD_REQUEST":
      addRequest(payload as ArchitectureRequest);
      break;

    case "CANCEL_REQUEST":
      cancelRequest(payload as string);
      break;

    default:
      console.error("Unknown message type:", type);
  }
});

// 워커 시작 메시지
console.log("Architecture Worker started");
