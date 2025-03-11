/**
 * https.ts
 *
 * HTTP 요청 관련 타입 정의 파일입니다.
 * API 에러, HTTP 메서드, 요청 설정, 응답 등의 타입을 정의합니다.
 */

/**
 * API 에러 클래스
 * HTTP 요청 중 발생한 에러를 표현합니다.
 *
 * @class ApiError
 * @extends Error
 * @property {number} status - HTTP 상태 코드
 * @property {any} data - 에러 응답 데이터
 */
export class ApiError extends Error {
  constructor(public status: number, public data: any, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * HTTP 메서드 타입
 * 지원하는 HTTP 메서드를 정의합니다.
 *
 * @typedef {string} HttpMethod
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * HTTP 요청 설정 인터페이스
 *
 * @interface RequestConfig
 * @property {Record<string, string>} [headers] - 요청 헤더
 * @property {any} [body] - 요청 바디
 * @property {number} [timeout] - 요청 타임아웃 (밀리초)
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

/**
 * API 응답 인터페이스
 *
 * @interface ApiResponse
 * @template T - 응답 데이터 타입
 * @property {T} data - 응답 데이터
 */
export interface ApiResponse<T = any> {
  data: T;
}
