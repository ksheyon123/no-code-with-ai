import { BluePrintObject } from "../types";
import {
  findBlueprintById,
  findBlueprintByIdBFS,
  findBlueprintWithPath,
  updateBlueprintById,
  getObjectReference,
  modifyObjectDirectly,
  updateChildDirectly,
} from "./blueprint";

// 테스트에 사용할 샘플 BluePrintObject 객체
const sampleBlueprint: BluePrintObject = {
  id: "root",
  type: "div",
  description: "루트 컨테이너",
  child: [
    {
      id: "header",
      type: "header",
      description: "헤더 영역",
      child: {
        id: "title",
        type: "h1",
        description: "제목",
        child: [],
        style: { color: "blue" },
      },
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

describe("findBlueprintByIdBFS", () => {
  test("루트 레벨 객체를 찾을 수 있어야 함", () => {
    const result = findBlueprintByIdBFS(sampleBlueprint, "root");
    expect(result).toBe(sampleBlueprint);
  });

  test("첫 번째 레벨 자식 객체를 찾을 수 있어야 함", () => {
    const result = findBlueprintByIdBFS(sampleBlueprint, "content");
    expect(result).toBeDefined();
    expect(result?.id).toBe("content");
    expect(result?.type).toBe("main");
  });

  test("중첩된 객체를 찾을 수 있어야 함", () => {
    const result = findBlueprintByIdBFS(sampleBlueprint, "title");
    expect(result).toBeDefined();
    expect(result?.id).toBe("title");
    expect(result?.style).toEqual({ color: "blue" });
  });

  test("존재하지 않는 ID에 대해 undefined를 반환해야 함", () => {
    const result = findBlueprintByIdBFS(sampleBlueprint, "nonexistent");
    expect(result).toBeUndefined();
  });
});

describe("findBlueprintWithPath", () => {
  test("루트 레벨 객체와 경로를 찾을 수 있어야 함", () => {
    const result = findBlueprintWithPath(sampleBlueprint, "root");
    expect(result).toBeDefined();
    expect(result?.object).toBe(sampleBlueprint);
    expect(result?.path).toEqual(["root"]);
  });

  test("중첩된 객체와 경로를 찾을 수 있어야 함", () => {
    const result = findBlueprintWithPath(sampleBlueprint, "title");
    expect(result).toBeDefined();
    expect(result?.object.id).toBe("title");
    expect(result?.path).toEqual(["root", "header", "title"]);
  });

  test("배열 내의 객체와 경로를 찾을 수 있어야 함", () => {
    const result = findBlueprintWithPath(sampleBlueprint, "paragraph2");
    expect(result).toBeDefined();
    expect(result?.object.id).toBe("paragraph2");
    expect(result?.path).toEqual(["root", "content", "paragraph2"]);
  });

  test("존재하지 않는 ID에 대해 null을 반환해야 함", () => {
    const result = findBlueprintWithPath(sampleBlueprint, "nonexistent");
    expect(result).toBeNull();
  });
});

describe("updateBlueprintById", () => {
  test("루트 객체를 업데이트할 수 있어야 함", () => {
    const updatedBlueprint = updateBlueprintById(
      sampleBlueprint,
      "root",
      (obj) => ({
        ...obj,
        description: "업데이트된 루트 컨테이너",
      })
    );

    expect(updatedBlueprint).not.toBe(sampleBlueprint); // 불변성 체크
    expect(updatedBlueprint.description).toBe("업데이트된 루트 컨테이너");
    // 원본은 변경되지 않아야 함
    expect(sampleBlueprint.description).toBe("루트 컨테이너");
  });

  test("중첩된 객체를 업데이트할 수 있어야 함", () => {
    const updatedBlueprint = updateBlueprintById(
      sampleBlueprint,
      "title",
      (obj) => ({
        ...obj,
        description: "업데이트된 제목",
        style: { ...obj.style, fontWeight: "bold" },
      })
    );

    const updatedTitle = findBlueprintById(updatedBlueprint, "title");
    expect(updatedTitle).toBeDefined();
    expect(updatedTitle?.description).toBe("업데이트된 제목");
    expect(updatedTitle?.style).toEqual({
      color: "blue",
      fontWeight: "bold",
    });

    // 원본은 변경되지 않아야 함
    const originalTitle = findBlueprintById(sampleBlueprint, "title");
    expect(originalTitle?.description).toBe("제목");
    expect(originalTitle?.style).toEqual({ color: "blue" });
  });

  test("배열 내의 객체를 업데이트할 수 있어야 함", () => {
    const updatedBlueprint = updateBlueprintById(
      sampleBlueprint,
      "paragraph1",
      (obj) => ({
        ...obj,
        description: "업데이트된 첫 번째 문단",
        attributes: {
          ...obj.attributes,
          "data-updated": true,
        },
      })
    );

    const updatedParagraph = findBlueprintById(updatedBlueprint, "paragraph1");
    expect(updatedParagraph).toBeDefined();
    expect(updatedParagraph?.description).toBe("업데이트된 첫 번째 문단");
    expect(updatedParagraph?.attributes).toEqual({
      "data-testid": "p1",
      "data-updated": true,
    });

    // 원본은 변경되지 않아야 함
    const originalParagraph = findBlueprintById(sampleBlueprint, "paragraph1");
    expect(originalParagraph?.description).toBe("첫 번째 문단");
    expect(originalParagraph?.attributes).toEqual({ "data-testid": "p1" });
  });

  test("존재하지 않는 ID에 대해 원본과 동일한 구조를 반환해야 함", () => {
    const updatedBlueprint = updateBlueprintById(
      sampleBlueprint,
      "nonexistent",
      (obj) => ({
        ...obj,
        description: "이 업데이트는 적용되지 않아야 함",
      })
    );

    // 구조는 같지만 참조는 다름 (불변성)
    expect(updatedBlueprint).not.toBe(sampleBlueprint);
    expect(JSON.stringify(updatedBlueprint)).toBe(
      JSON.stringify(sampleBlueprint)
    );
  });
});

// 객체 직접 수정 관련 테스트
describe("객체 직접 수정 테스트", () => {
  test("getObjectReference로 가져온 객체를 직접 수정할 수 있어야 함", () => {
    // 원본 객체 복사
    const blueprint = JSON.parse(JSON.stringify(sampleBlueprint));

    // 객체 참조 가져오기
    const contentRef = getObjectReference(blueprint, "content");

    // 참조가 존재하는지 확인
    expect(contentRef).toBeDefined();

    if (contentRef) {
      // 직접 객체 수정
      contentRef.description = "수정된 본문 영역";
      contentRef.style = { backgroundColor: "lightgray" };

      // 원본 객체가 수정되었는지 확인
      const updatedContent = findBlueprintById(blueprint, "content");
      expect(updatedContent?.description).toBe("수정된 본문 영역");
      expect(updatedContent?.style).toEqual({ backgroundColor: "lightgray" });
    }
  });

  test("modifyObjectDirectly로 여러 속성을 한 번에 수정할 수 있어야 함", () => {
    // 원본 객체 복사
    const blueprint = JSON.parse(JSON.stringify(sampleBlueprint));

    // 객체 직접 수정
    const updatedObject = modifyObjectDirectly(blueprint, "title", {
      description: "수정된 제목",
      style: { color: "red", fontWeight: "bold" },
      attributes: { "data-testid": "title" },
    });

    // 수정된 객체가 반환되었는지 확인
    expect(updatedObject).toBeDefined();

    // 원본 객체가 수정되었는지 확인
    const titleObj = findBlueprintById(blueprint, "title");
    expect(titleObj?.description).toBe("수정된 제목");
    expect(titleObj?.style).toEqual({ color: "red", fontWeight: "bold" });
    expect(titleObj?.attributes).toEqual({ "data-testid": "title" });
  });

  test("updateChildDirectly로 child 속성을 수정할 수 있어야 함", () => {
    // 원본 객체 복사
    const blueprint = JSON.parse(JSON.stringify(sampleBlueprint));

    // 새로운 child 객체
    const newChild: BluePrintObject[] = [
      {
        id: "newParagraph1",
        type: "p",
        description: "새로운 첫 번째 문단",
        child: [],
      },
      {
        id: "newParagraph2",
        type: "p",
        description: "새로운 두 번째 문단",
        child: [],
      },
    ];

    // child 속성 직접 수정
    const updatedObject = updateChildDirectly(blueprint, "content", newChild);

    // 수정된 객체가 반환되었는지 확인
    expect(updatedObject).toBeDefined();

    // 원본 객체가 수정되었는지 확인
    const contentObj = findBlueprintById(blueprint, "content");
    expect(Array.isArray(contentObj?.child)).toBe(true);
    expect((contentObj?.child as BluePrintObject[]).length).toBe(2);
    expect((contentObj?.child as BluePrintObject[])[0].id).toBe(
      "newParagraph1"
    );
    expect((contentObj?.child as BluePrintObject[])[1].id).toBe(
      "newParagraph2"
    );
  });

  test("findBlueprintById로 가져온 객체를 직접 수정하는 예시", () => {
    // 원본 객체 복사
    const blueprint = JSON.parse(JSON.stringify(sampleBlueprint));

    // 객체 찾기
    const headerObj = findBlueprintById(blueprint, "header");

    // 객체가 존재하는지 확인
    expect(headerObj).toBeDefined();

    if (headerObj) {
      // 직접 객체 수정
      headerObj.description = "수정된 헤더 영역";
      headerObj.attributes = { "data-section": "header" };

      // 원본 객체가 수정되었는지 확인
      const updatedHeader = findBlueprintById(blueprint, "header");
      expect(updatedHeader?.description).toBe("수정된 헤더 영역");
      expect(updatedHeader?.attributes).toEqual({ "data-section": "header" });
    }
  });

  test("객체의 메모리 주소가 유지되는지 확인", () => {
    // 원본 객체 복사
    const blueprint = JSON.parse(JSON.stringify(sampleBlueprint));

    // 객체 참조 가져오기
    const headerRef1 = getObjectReference(blueprint, "header");
    const headerRef2 = findBlueprintById(blueprint, "header");

    // 두 참조가 같은 객체를 가리키는지 확인
    expect(headerRef1).toBe(headerRef2);

    // 객체 수정
    if (headerRef1 && headerRef2) {
      headerRef1.description = "참조1에서 수정";

      // headerRef2도 같은 객체를 가리키므로 변경이 반영되어야 함
      expect(headerRef2.description).toBe("참조1에서 수정");
    }
  });
});

// 복잡한 중첩 구조에 대한 추가 테스트
describe("복잡한 중첩 구조 테스트", () => {
  // 더 복잡한 중첩 구조를 가진 테스트 객체
  const complexBlueprint: BluePrintObject = {
    id: "app",
    type: "div",
    description: "애플리케이션 루트",
    child: {
      id: "layout",
      type: "div",
      description: "레이아웃 컨테이너",
      child: [
        {
          id: "sidebar",
          type: "aside",
          description: "사이드바",
          child: [
            {
              id: "menu",
              type: "nav",
              description: "메뉴",
              child: [
                {
                  id: "menuItem1",
                  type: "a",
                  description: "메뉴 항목 1",
                  child: [],
                },
                {
                  id: "menuItem2",
                  type: "a",
                  description: "메뉴 항목 2",
                  child: [],
                },
              ],
            },
          ],
        },
        {
          id: "mainContent",
          type: "main",
          description: "메인 콘텐츠",
          child: [],
        },
      ],
    },
  };

  test("깊게 중첩된 객체를 DFS로 찾을 수 있어야 함", () => {
    const result = findBlueprintById(complexBlueprint, "menuItem2");
    expect(result).toBeDefined();
    expect(result?.id).toBe("menuItem2");
    expect(result?.description).toBe("메뉴 항목 2");
  });

  test("깊게 중첩된 객체를 BFS로 찾을 수 있어야 함", () => {
    const result = findBlueprintByIdBFS(complexBlueprint, "menuItem1");
    expect(result).toBeDefined();
    expect(result?.id).toBe("menuItem1");
    expect(result?.description).toBe("메뉴 항목 1");
  });

  test("깊게 중첩된 객체의 경로를 찾을 수 있어야 함", () => {
    const result = findBlueprintWithPath(complexBlueprint, "menuItem1");
    expect(result).toBeDefined();
    expect(result?.object.id).toBe("menuItem1");
    expect(result?.path).toEqual([
      "app",
      "layout",
      "sidebar",
      "menu",
      "menuItem1",
    ]);
  });

  test("깊게 중첩된 객체를 업데이트할 수 있어야 함", () => {
    const updatedBlueprint = updateBlueprintById(
      complexBlueprint,
      "menu",
      (obj) => ({
        ...obj,
        description: "업데이트된 메뉴",
      })
    );

    const updatedMenu = findBlueprintById(updatedBlueprint, "menu");
    expect(updatedMenu).toBeDefined();
    expect(updatedMenu?.description).toBe("업데이트된 메뉴");

    // 원본은 변경되지 않아야 함
    const originalMenu = findBlueprintById(complexBlueprint, "menu");
    expect(originalMenu?.description).toBe("메뉴");
  });
});
