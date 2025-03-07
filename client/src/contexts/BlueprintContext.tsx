import { BluePrintObject } from "@/types";
import { findBlueprintById, updateChildDirectly } from "@/utils/blueprint";
import { createContext, ReactNode, useContext, useState } from "react";

interface BlueprintContextType {
  blueprints: BluePrintObject | null;
  addBlueprint: Function;
  updateBlueprint: Function;
  insertBlueprint: Function;
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

  const insertBlueprint = (
    targetId: string,
    parentId: string,
    config: Omit<BluePrintObject, "id">
  ) => {
    if (!!blueprints) {
      const blueprint = findBlueprintById(blueprints, parentId);

      if (blueprint) {
        updateChildDirectly(blueprint, targetId, [
          {
            id: targetId,
            ...config,
          },
        ]);
      }
      if (blueprint?.child) {
        updateChildDirectly(blueprint, targetId, [
          ...blueprint.child,
          {
            id: targetId,
            ...config,
          },
        ]);
      }
    }
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
    insertBlueprint,
    blueprints,
  };

  return (
    <BlueprintContext.Provider value={value}>
      {children}
    </BlueprintContext.Provider>
  );
};
