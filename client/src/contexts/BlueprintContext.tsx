import { DOMBluePrint } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface BlueprintContextType {
  blueprints: Map<string, DOMBluePrint>;
  initBlueprint: Function;
  updateBlueprint: Function;
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
  const [blueprints, setBlueprints] = useState<Map<string, DOMBluePrint>>(
    new Map()
  );

  const initBlueprint = (newId: string, config: DOMBluePrint) => {
    const newBlueprints = new Map(blueprints);
    newBlueprints.set(newId, config);
    setBlueprints(newBlueprints);
  };

  const updateBlueprint = (
    newId: string,
    curElId: string,
    config: DOMBluePrint
  ) => {
    const prevBlueprint = new Map(blueprints);
    const targetBlueprint = prevBlueprint.get(curElId);
    // 객체의 children에 추가
    if (targetBlueprint && targetBlueprint.children) {
      targetBlueprint.children.push(newId);
    }
    // Blueprint 추가
    initBlueprint(newId, config);
  };

  const value = {
    initBlueprint,
    updateBlueprint,
    blueprints,
  };

  return (
    <BlueprintContext.Provider value={value}>
      {children}
    </BlueprintContext.Provider>
  );
};
