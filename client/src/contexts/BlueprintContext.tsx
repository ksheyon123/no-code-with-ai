import { BluePrintObject } from "@/types";
import { findBlueprintById } from "@/utils/blueprint";
import { createContext, ReactNode, useContext, useState } from "react";

interface BlueprintContextType {
  blueprints: BluePrintObject | null;
  addBlueprint: Function;
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
  const [blueprints, setBlueprints] = useState<BluePrintObject | null>(null);

  const addBlueprint = (
    targetId: string,
    config: Omit<BluePrintObject, "id">
  ) => {
    setBlueprints({
      id: targetId,
      ...config,
    });
  };

  const updateBlueprint = (
    targetId: string,
    config: Omit<BluePrintObject, "id">
  ) => {
    if (!blueprints || targetId) {
      addBlueprint(targetId, config);
    } else {
      const blueprint = findBlueprintById(blueprints, targetId);
    }
  };

  const value = {
    addBlueprint,
    updateBlueprint,
    blueprints,
  };

  return (
    <BlueprintContext.Provider value={value}>
      {children}
    </BlueprintContext.Provider>
  );
};
