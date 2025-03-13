import { DOMStructureProps, Blueprint } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface BlueprintContextType {
  blueprints: Map<string, Blueprint>;
  domStructure: Map<string, DOMStructureProps>;
  initBlueprint: (newId: string, params: Blueprint) => void;
  updateBlueprint: (newId: string, params: Blueprint) => void;
  initDomStructure: (
    newId: string,
    params: { children: string[]; siblings: string[] }
  ) => void;
  updateDomStructure: (
    newId: string,
    children?: string[],
    siblings?: string[]
  ) => void;
}

const BlueprintContext = createContext<BlueprintContextType | undefined>(
  undefined
);

export const useBlueprintContext = () => {
  const context = useContext(BlueprintContext);
  if (context === undefined) {
    throw new Error(
      "useBlueprintContext must be used within a BlueprintContextProvider"
    );
  }
  return context;
};

interface BlueprintContextProviderProps {
  children: ReactNode;
}

export const BlueprintContextProvider: React.FC<
  BlueprintContextProviderProps
> = ({ children }) => {
  const [blueprints, setBlueprints] = useState<Map<string, Blueprint>>(
    new Map()
  );
  const [domStructure, setDomStructure] = useState<
    Map<string, DOMStructureProps>
  >(new Map());

  /**
   *
   * @param newId 새 blueprint의 ID
   * @param config blueprint의 Configuration
   */
  const initBlueprint = (newId: string, params: Blueprint) => {
    const newBlueprints = new Map(blueprints);
    newBlueprints.set(newId, params);
    setBlueprints(newBlueprints);
  };

  /**
   *
   * @param newId 새로 생성되는 객체 ID
   * @param params 새로 생성되는 객체의 config
   */
  const updateBlueprint = (newId: string, params: Blueprint) => {
    setBlueprints((prevBlueprints) => {
      const curBlueprint = new Map(prevBlueprints);
      let targetBlueprint = curBlueprint.get(newId);
      if (!targetBlueprint) {
        curBlueprint.set(newId, params);
      } else {
        targetBlueprint = {
          ...targetBlueprint,
          ...params,
        };
        curBlueprint.set(newId, targetBlueprint);
      }
      return curBlueprint;
    });
  };

  const removeBlueprint = () => {};

  const initDomStructure = (
    newId: string,
    params: { children: string[]; siblings: string[] }
  ) => {
    const curDomStructure = new Map(domStructure);
    curDomStructure.set(newId, params);
    setDomStructure(curDomStructure);
  };

  const updateDomStructure = (
    targetId: string,
    children?: string[],
    siblings?: string[]
  ) => {
    const curDomStructure = new Map(domStructure);
    const targetDomStructure = curDomStructure.get(targetId);

    if (targetDomStructure) {
      if (children) {
        // Create a new array with the concatenated values
        targetDomStructure.children = [
          ...targetDomStructure.children,
          ...children,
        ];
      }

      if (siblings) {
        // Create a new array with the concatenated values
        targetDomStructure.siblings = [
          ...targetDomStructure.siblings,
          ...siblings,
        ];
      }

      // Update the map with the modified structure
      curDomStructure.set(targetId, targetDomStructure);
      setDomStructure(curDomStructure);
    }
  };

  const removeDomStructure = () => {};

  const value = {
    initBlueprint,
    updateBlueprint,
    initDomStructure,
    updateDomStructure,
    blueprints,
    domStructure,
  };

  return (
    <BlueprintContext.Provider value={value}>
      {children}
    </BlueprintContext.Provider>
  );
};
