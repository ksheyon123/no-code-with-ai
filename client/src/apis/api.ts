import { DOMBluePrint } from "@/types";
import { post } from "./https";

const sendArchitecture = async (params: any) =>
  post<{ data: DOMBluePrint }>(
    `http://localhost:8000/api/langchain/req_ui_component`,
    params
  );

export { sendArchitecture };
