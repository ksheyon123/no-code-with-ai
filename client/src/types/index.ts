export type DOMBluePrint = {};

export type BluePrintObject = {
  id: string;
  type: string;
  description: string;
  child?: BluePrintObject | BluePrintObject[];
  attributes?: Record<string, string | number | boolean>;
  style?: Record<string, string | number>;
};
