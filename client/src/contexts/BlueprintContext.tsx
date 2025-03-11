import { DOMBluePrint } from "@/types";
import { findBlueprintById } from "@/utils/blueprint";
import { createContext, ReactNode, useContext, useState } from "react";

interface BlueprintContextType {
  blueprints: DOMBluePrint | null;
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
  const [blueprints, setBlueprints] = useState<DOMBluePrint | null>(null);

  const initBlueprint = (config: Omit<DOMBluePrint, "id">) => {
    setBlueprints({
      id: "root",
      ...config,
    });
  };

  const updateBlueprint = (
    newId: string,
    targetId: string,
    config: Omit<DOMBluePrint, "id">
  ) => {
    setBlueprints((prev) => {
      if (prev) {
        const blueprint = findBlueprintById(prev, targetId);
        if (blueprint) {
          blueprint.child = blueprint.child
            ? [
                ...blueprint.child,
                {
                  id: newId,
                  ...config,
                },
              ]
            : [
                {
                  id: newId,
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
