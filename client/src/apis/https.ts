/**
 * HTTP 요청 처리를 위한 유틸리티 모듈
 *
 * 이 모듈은 fetch API를 래핑하여 타입 안전성과 에러 처리, 타임아웃 기능을 제공합니다.
 * 모든 HTTP 메서드(GET, POST, PUT, DELETE, PATCH)에 대한 편의 함수를 제공합니다.
 */
import {
  ApiError,
  ApiResponse,
  HttpMethod,
  RequestConfig,
} from "@/types/https";

const DEFAULT_TIMEOUT = 30000; // 30초 타임아웃 (LangChain 모델 처리를 위해 증가)
/**
 * 모든 요청에 적용되는 기본 헤더
 */
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * 기본 API 요청 함수
 *
 * @param url - 요청할 URL
 * @param method - HTTP 메서드 (GET, POST, PUT, DELETE, PATCH)
 * @param config - 요청 설정 (헤더, 바디, 타임아웃 등)
 * @returns 응답 데이터를 포함한 Promise
 */
const api = async <T = { data: any }>(
  url: string,
  method: HttpMethod,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timeout = config.timeout || DEFAULT_TIMEOUT;
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    // fetch API를 사용하여 HTTP 요청 실행
    const response = await fetch(url, {
      method,
      headers: {
        ...DEFAULT_HEADERS,
        ...config.headers,
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    // 응답 상태 코드가 성공(2xx)이 아닌 경우 에러 처리
    if (!response.ok) {
      throw new ApiError(
        response.status,
        data,
        `Request failed with status ${response.status}`
      );
    }

    return {
      data,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    // 에러 타입별 처리
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      // 타임아웃 에러 처리
      if (error.name === "AbortError") {
        throw new ApiError(408, null, `Request timeout after ${timeout}ms`);
      }
      throw new ApiError(500, null, error.message);
    }

    throw new ApiError(500, null, "An unexpected error occurred");
  }
};

/**
 * HTTP 메서드별 편의 함수
 * 기본 api 함수를 래핑하여 더 간단한 인터페이스 제공
 */

/**
 * GET 요청 함수
 *
 * @param url - 요청할 URL
 * @param config - 요청 설정
 * @returns 응답 데이터를 포함한 Promise
 */
export const get = <T = any>(url: string, config?: RequestConfig) =>
  api<T>(url, "GET", config);

/**
 * POST 요청 함수
 *
 * @param url - 요청할 URL
 * @param body - 요청 바디
 * @param config - 요청 설정
 * @returns 응답 데이터를 포함한 Promise
 */
export const post = <T = any>(url: string, body: any, config?: RequestConfig) =>
  api<T>(url, "POST", { ...config, body });

/**
 * PUT 요청 함수
 *
 * @param url - 요청할 URL
 * @param body - 요청 바디
 * @param config - 요청 설정
 * @returns 응답 데이터를 포함한 Promise
 */
export const put = <T = any>(url: string, body: any, config?: RequestConfig) =>
  api<T>(url, "PUT", { ...config, body });

/**
 * DELETE 요청 함수
 *
 * @param url - 요청할 URL
 * @param config - 요청 설정
 * @returns 응답 데이터를 포함한 Promise
 */
export const del = <T = any>(url: string, config?: RequestConfig) =>
  api<T>(url, "DELETE", config);

/**
 * PATCH 요청 함수
 *
 * @param url - 요청할 URL
 * @param body - 요청 바디
 * @param config - 요청 설정
 * @returns 응답 데이터를 포함한 Promise
 */
export const patch = <T = any>(
  url: string,
  body: any,
  config?: RequestConfig
) => api<T>(url, "PATCH", { ...config, body });
