import { BluePrintObject } from "@/types";
import { findBlueprintById, updateChildDirectly } from "@/utils/blueprint";
import { createContext, ReactNode, useContext, useState } from "react";

interface BlueprintContextType {
  blueprints: BluePrintObject | null;
  initBlueprint: Function;
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

  const initBlueprint = (config: Omit<BluePrintObject, "id">) => {
    setBlueprints({
      id: "root",
      ...config,
    });
  };

  const addBlueprint = (
    targetId: string,
    parentId: string,
    config: Omit<BluePrintObject, "id">
  ) => {
    console.log(targetId, parentId);
    setBlueprints((prev) => {
      if (prev) {
        const blueprint = findBlueprintById(prev, parentId);
        if (blueprint) {
          blueprint.child = [
            {
              id: targetId,
              ...config,
            },
          ];
        }
        return {
          ...prev,
        };
      }

      return prev;
    });
  };

  const insertBlueprint = (
    targetId: string,
    parentId: string,
    config: Omit<BluePrintObject, "id">
  ) => {
    if (!!blueprints) {
      console.log(targetId);
      const blueprint = findBlueprintById(blueprints, parentId);
      if (blueprint) {
        updateChildDirectly(blueprint, parentId, [
          {
            id: targetId,
            ...config,
          },
        ]);
        console.log(blueprints);
      }
      if (blueprint?.child) {
        updateChildDirectly(blueprint, parentId, [
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
      // addBlueprint(targetId, config);
    } else {
      const blueprint = findBlueprintById(blueprints, targetId);
    }
  };

  const value = {
    initBlueprint,
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
