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

export type DOMBluePrint = {
  id: string;
  type: string;
  description?: string;
  label?: string;
  tag?: "div" | "ul" | "li";
  child?: DOMBluePrint[];
  attributes?: Record<string, string | number | boolean>;
  style?: Record<string, string | number>;
};
