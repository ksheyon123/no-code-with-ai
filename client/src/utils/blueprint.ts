import { DOMBluePrint } from "../types";

/**
 * 재귀적 깊이 우선 탐색(DFS)을 사용하여 BluePrintObject 트리에서 특정 ID를 가진 객체를 찾습니다.
 * @param blueprint 검색할 BluePrintObject 트리
 * @param targetId 찾고자 하는 ID
 * @returns 찾은 BluePrintObject 또는 undefined
 */
export const findBlueprintById = (
  blueprint: DOMBluePrint,
  targetId: string
): DOMBluePrint | undefined => {
  // 현재 객체의 ID가 찾고자 하는 ID와 일치하는지 확인
  if (blueprint.id === targetId) {
    return blueprint;
  }

  // 자식이 없는 경우
  if (!blueprint.child) {
    return undefined;
  }

  // 자식이 배열인 경우
  if (Array.isArray(blueprint.child)) {
    for (const child of blueprint.child) {
      const found = findBlueprintById(child, targetId);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  // 자식이 단일 객체인 경우
  return findBlueprintById(blueprint.child, targetId);
};
