import { post } from "./https";
import { ResponseJSX } from "@/types/https";

const sendArchitecture = async (params: any) =>
  post<{ data: ResponseJSX }>(
    `http://localhost:8000/api/langchain/req_ui_component`,
    params,
    { timeout: 60000 } // 60초 타임아웃 (LangChain 모델 처리를 위해 충분한 시간 설정)
  );

export { sendArchitecture };
