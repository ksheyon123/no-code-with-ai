import { DOMBluePrint } from "../types";
import { findBlueprintById } from "./blueprint";

// 테스트에 사용할 샘플 BluePrintObject 객체
const sampleBlueprint: DOMBluePrint = {
  id: "root",
  type: "div",
  description: "루트 컨테이너",
  child: [
    {
      id: "header",
      type: "header",
      description: "헤더 영역",
      child: [
        {
          id: "title",
          type: "h1",
          description: "제목",
          child: [],
          style: { color: "blue" },
        },
      ],
    },
    {
      id: "content",
      type: "main",
      description: "본문 영역",
      child: [
        {
          id: "paragraph1",
          type: "p",
          description: "첫 번째 문단",
          child: [],
          attributes: { "data-testid": "p1" },
        },
        {
          id: "paragraph2",
          type: "p",
          description: "두 번째 문단",
          child: [],
        },
      ],
    },
    {
      id: "footer",
      type: "footer",
      description: "푸터 영역",
      child: [],
    },
  ],
};

describe("findBlueprintById", () => {
  test("루트 레벨 객체를 찾을 수 있어야 함", () => {
    const result = findBlueprintById(sampleBlueprint, "root");
    expect(result).toBe(sampleBlueprint);
  });

  test("첫 번째 레벨 자식 객체를 찾을 수 있어야 함", () => {
    const result = findBlueprintById(sampleBlueprint, "header");
    expect(result).toBeDefined();
    expect(result?.id).toBe("header");
    expect(result?.type).toBe("header");
  });

  test("중첩된 객체를 찾을 수 있어야 함", () => {
    const result = findBlueprintById(sampleBlueprint, "title");
    expect(result).toBeDefined();
    expect(result?.id).toBe("title");
    expect(result?.type).toBe("h1");
    expect(result?.style).toEqual({ color: "blue" });
  });

  test("배열 내의 객체를 찾을 수 있어야 함", () => {
    const result = findBlueprintById(sampleBlueprint, "paragraph1");
    expect(result).toBeDefined();
    expect(result?.id).toBe("paragraph1");
    expect(result?.attributes).toEqual({ "data-testid": "p1" });
  });

  test("존재하지 않는 ID에 대해 undefined를 반환해야 함", () => {
    const result = findBlueprintById(sampleBlueprint, "nonexistent");
    expect(result).toBeUndefined();
  });
});
