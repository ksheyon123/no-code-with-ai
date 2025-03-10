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
