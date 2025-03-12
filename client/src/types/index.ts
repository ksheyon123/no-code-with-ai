/**
 * DOM 객체 청사진 인터페이스
 *
 * @interface DOMBluePrint
 * @property {string} id - DOM 객체의 ID
 * @property {string} type - DOM 객체의 타입
 * @property {string} [description] - DOM 객체에 대한 설명
 * @property {string} [label] - DOM 객체의 라벨
 * @property {"div" | "ul" | "li" | "section" | "span" | "p"} [tag] - DOM 객체의 HTML 태그
 * @property {DOMBluePrint[]} [child] - 자식 DOM 객체 배열
 * @property {Record<string, string | number | boolean>} [attributes] - DOM 객체의 속성
 * @property {Record<string, string | number>} [style] - DOM 객체의 스타일
 */

// 사용자 입력 관련 속성
export type ElementGenerationParams = {
  type: string;
  description?: string;
  label?: string;
  radioType?: string;
  parentElId?: string;
  curElId?: string;
};

// 서버에서 제공하는 속성
export type Blueprint = {
  new_id: string;
  jsx_code: string;
  component_name: string;
  imports: string[];
  attributes?: Record<string, string | number | boolean>;
  styles?: Record<string, string | number>;
};

// DOM 구조 관련 속성
export type DOMStructureProps = {
  children: string[];
  siblings: string[];
};

export type DOMComponentFormat = {};
