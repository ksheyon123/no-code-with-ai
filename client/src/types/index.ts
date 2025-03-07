export type DOMBluePrint = {};

export type BluePrintObject = {
  id: string;
  type: string;
  description: string;
  tag?: "div" | "ul" | "li";
  label?: string;
  child?: BluePrintObject[];
  attributes?: Record<string, string | number | boolean>;
  style?: Record<string, string | number>;
};
