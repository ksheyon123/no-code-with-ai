import { post } from "./https";
import { ResponseJSX } from "@/types/https";

/**
 * 아키텍처 정보를 서버로 전송하는 함수
 *
 * @param params - 전송할 파라미터
 * @returns 서버 응답 데이터
 */
const sendArchitecture = async (params: any) =>
  post<{ data: ResponseJSX }>(
    `http://localhost:8000/api/langchain/req_ui_component`,
    params,
    { timeout: 60000 } // 60초 타임아웃 (LangChain 모델 처리를 위해 충분한 시간 설정)
  );

/**
 * 이미지를 서버로 업로드하는 함수
 *
 * @param imageData - 업로드할 이미지 데이터 객체
 * @returns 서버 응답 데이터
 */
const uploadImage = async (imageData: {
  fileName: string;
  fileType: string;
  base64Data: string;
  fileSize: number;
}) =>
  post(
    `http://localhost:8000/api/langchain/req_sample_runnables`,
    imageData,
    { timeout: 60000 } // 30초 타임아웃
  );

export { sendArchitecture, uploadImage };
