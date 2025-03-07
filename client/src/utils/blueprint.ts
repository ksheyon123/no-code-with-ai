import { BluePrintObject } from "../types";

/**
 * 객체를 직접 수정하기 위한 참조를 가져옵니다.
 * 주의: 이 함수는 원본 객체의 참조를 반환하므로, 반환된 객체를 수정하면 원본 객체도 함께 수정됩니다.
 * @param blueprint 검색할 BluePrintObject 트리
 * @param targetId 찾고자 하는 ID
 * @returns 찾은 BluePrintObject에 대한 참조 또는 undefined
 */
export const getObjectReference = (
  blueprint: BluePrintObject,
  targetId: string
): BluePrintObject | undefined => {
  return findBlueprintById(blueprint, targetId);
};

/**
 * 객체의 메모리 주소를 유지하면서 객체 내부 속성을 직접 수정합니다.
 * 이 함수는 원본 객체를 직접 수정하므로 주의해서 사용해야 합니다.
 * @param blueprint 검색할 BluePrintObject 트리
 * @param targetId 수정할 객체의 ID
 * @param updates 업데이트할 속성들을 포함하는 객체
 * @returns 수정된 객체에 대한 참조 또는 undefined (객체를 찾지 못한 경우)
 */
export const modifyObjectDirectly = (
  blueprint: BluePrintObject,
  targetId: string,
  updates: Partial<BluePrintObject>
): BluePrintObject | undefined => {
  const foundObject = findBlueprintById(blueprint, targetId);

  if (foundObject) {
    // 객체의 속성을 직접 수정
    Object.keys(updates).forEach((key) => {
      // @ts-ignore - 동적 속성 접근
      foundObject[key] = updates[key];
    });

    return foundObject;
  }

  return undefined;
};

/**
 * 예시: 객체의 메모리 주소를 유지하면서 child 속성을 업데이트하는 방법
 * @param blueprint 검색할 BluePrintObject 트리
 * @param targetId 수정할 객체의 ID
 * @param newChild 새로운 child 값
 * @returns 수정된 객체에 대한 참조 또는 undefined (객체를 찾지 못한 경우)
 */
export const updateChildDirectly = (
  blueprint: BluePrintObject,
  targetId: string,
  newChild: BluePrintObject[]
): BluePrintObject | undefined => {
  const foundObject = findBlueprintById(blueprint, targetId);

  if (foundObject) {
    // child 속성을 직접 수정
    foundObject.child = newChild;
    return foundObject;
  }

  return undefined;
};

/**
 * 재귀적 깊이 우선 탐색(DFS)을 사용하여 BluePrintObject 트리에서 특정 ID를 가진 객체를 찾습니다.
 * @param blueprint 검색할 BluePrintObject 트리
 * @param targetId 찾고자 하는 ID
 * @returns 찾은 BluePrintObject 또는 undefined
 */
export const findBlueprintById = (
  blueprint: BluePrintObject,
  targetId: string
): BluePrintObject | undefined => {
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

/**
 * 너비 우선 탐색(BFS)을 사용하여 BluePrintObject 트리에서 특정 ID를 가진 객체를 찾습니다.
 * @param blueprint 검색할 BluePrintObject 트리
 * @param targetId 찾고자 하는 ID
 * @returns 찾은 BluePrintObject 또는 undefined
 */
export const findBlueprintByIdBFS = (
  blueprint: BluePrintObject,
  targetId: string
): BluePrintObject | undefined => {
  // 검색할 객체들을 저장할 큐
  const queue: BluePrintObject[] = [blueprint];

  while (queue.length > 0) {
    // 큐에서 객체 하나를 꺼냄
    const current = queue.shift()!;

    // 현재 객체의 ID가 찾고자 하는 ID와 일치하는지 확인
    if (current.id === targetId) {
      return current;
    }

    // 자식이 있는 경우 큐에 추가
    if (current.child) {
      if (Array.isArray(current.child)) {
        queue.push(...current.child);
      } else {
        queue.push(current.child);
      }
    }
  }

  // 찾지 못한 경우
  return undefined;
};

/**
 * 재귀적 깊이 우선 탐색(DFS)을 사용하여 BluePrintObject 트리에서 특정 ID를 가진 객체를 찾고,
 * 해당 객체의 경로(부모 객체들의 ID 배열)도 함께 반환합니다.
 * @param blueprint 검색할 BluePrintObject 트리
 * @param targetId 찾고자 하는 ID
 * @param path 현재까지의 경로 (재귀 호출 시 내부적으로 사용)
 * @returns 찾은 객체와 경로를 포함하는 객체 또는 null
 */
export const findBlueprintWithPath = (
  blueprint: BluePrintObject,
  targetId: string,
  path: string[] = []
): { object: BluePrintObject; path: string[] } | null => {
  const currentPath = [...path, blueprint.id];

  if (blueprint.id === targetId) {
    return { object: blueprint, path: currentPath };
  }

  if (!blueprint.child) {
    return null;
  }

  if (Array.isArray(blueprint.child)) {
    for (const child of blueprint.child) {
      const found = findBlueprintWithPath(child, targetId, currentPath);
      if (found) {
        return found;
      }
    }
    return null;
  }

  return findBlueprintWithPath(blueprint.child, targetId, currentPath);
};
