import { BluePrintObject } from "@/types";
import { findBlueprintById } from "@/utils/blueprint";
import { createContext, ReactNode, useContext, useState } from "react";

interface BlueprintContextType {
  blueprints: BluePrintObject | null;
  updateCurrentBlueprint: Function;
  updateParentBlueprint: Function;
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
  const [targetId, setTargetId] = useState<string>("");
  const [blueprints, setBlueprints] = useState<BluePrintObject | null>(null);

  const updateParentBlueprint = (
    targetId: string,
    config: Omit<BluePrintObject, "id">
  ) => {
    if (!blueprints || targetId) {
      // updateBlueprintById();
    } else {
      const blueprint = findBlueprintById(blueprints, targetId);
    }
  };

  const updateCurrentBlueprint = (targetId: string) => {
    blueprints;
    // setBlueprints()
  };

  const value = {
    updateCurrentBlueprint,
    updateParentBlueprint,
    blueprints,
  };

  return (
    <BlueprintContext.Provider value={value}>
      {children}
    </BlueprintContext.Provider>
  );
};
