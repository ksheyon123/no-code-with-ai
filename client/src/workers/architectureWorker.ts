/**
 * 아키텍처 생성 요청을 처리하는 웹 워커
 *
 * 이 워커는 UI 아키텍처 생성 요청을 큐에 넣고 Semaphore를 사용하여 최대 5개까지 동시에 처리합니다.
 * 메인 스레드가 차단되지 않도록 별도의 스레드에서 작업을 수행합니다.
 */

import { sendArchitecture } from "@/apis/api";
import { post } from "../apis/https";
import { ElementGenerationParams } from "@/types";
import Semaphore from "../utils/Semaphore";

// 타입 정의
interface ArchitectureRequest {
  newId: string;
  targetId: string;
  params: ElementGenerationParams; // 아키텍처 청사진 데이터
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

// 요청 큐와 세마포어 (최대 5개 동시 처리)
let requestQueue: ArchitectureRequest[] = [];
const semaphore = new Semaphore(5);

/**
 * 요청을 처리합니다.
 * @param request 처리할 요청
 */
async function processRequest(request: ArchitectureRequest) {
  try {
    // 세마포어 획득 (최대 5개까지 동시 실행, 나머지는 대기)
    await semaphore.acquire();

    // 진행 상태 알림
    self.postMessage({
      type: "PROGRESS",
      requestId: request.newId,
      payload: {
        status: "processing",
        message: "코드 생성 중...",
        progress: 0,
      },
    } as WorkerResponse);

    const newParams = {
      newId: request.newId,
      targetId: request.targetId,
      ...request.params,
    };

    // 서버에 요청 전송
    const { data } = await sendArchitecture(newParams);
    console.log(data);
    // 결과 전송
    self.postMessage({
      type: "RESULT",
      requestId: request.newId,
      payload: data,
    } as WorkerResponse);
  } catch (error) {
    // 에러 전송
    self.postMessage({
      type: "ERROR",
      requestId: request.newId,
      payload: {
        message:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
        error,
      },
    } as WorkerResponse);
  } finally {
    // 세마포어 해제 (다음 대기 중인 요청이 실행될 수 있도록)
    semaphore.release();

    // 처리 완료된 요청을 큐에서 제거
    requestQueue = requestQueue.filter((req) => req.newId !== request.newId);
  }
}

/**
 * 새 요청을 큐에 추가하고 처리를 시작합니다.
 */
function addRequest(request: ArchitectureRequest) {
  requestQueue.push(request);

  // 요청 처리 시작 (세마포어가 처리 가능한 요청 수를 제한함)
  processRequest(request);
}

/**
 * 특정 ID의 요청을 취소합니다.
 * 참고: 이미 처리 중인 요청은 취소할 수 없으며, 대기 중인 요청만 취소됩니다.
 */
function cancelRequest(requestId: string) {
  // 큐에서 해당 ID의 요청 제거
  requestQueue = requestQueue.filter((req) => req.newId !== requestId);
}

/**
 * 메시지 이벤트 리스너
 */
self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;
  console.log(type, payload);
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
