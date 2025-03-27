import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";
import { ElementGenerationParams, Blueprint } from "@/types";
import { createRandomHash } from "@/utils/crypto";
import { transpileJSX } from "@/utils/ui";
import { generateArchitectureCode } from "@/workers/architectureWorkerManager";

const UISelectModalFooter = () => {
  const { updateBlueprint, initDomStructure, updateDomStructure } =
    useBlueprintContext();
  const { modalState } = useModalContext<ElementGenerationParams>();
  const add = () => {
    const { curElId } = modalState;
    const tagId = createRandomHash();
    updateDomStructure(curElId || "", [tagId]);
    initDomStructure(tagId, { children: [], siblings: [] });
    generateArchitectureCode(
      tagId,
      modalState.curElId!,
      {
        ...modalState,
      },
      {
        onSuccess: ({ message }: { message: Blueprint }) => {
          const { new_id } = message;
          const TranspiledComponent = transpileJSX(message);
          updateBlueprint(new_id, message, TranspiledComponent);
        },
      }
    );
  };

  const insert = () => {
    const { parentElId } = modalState;
    const tagId = createRandomHash();
    updateDomStructure(parentElId || "", [tagId]);
    initDomStructure(tagId, { children: [], siblings: [] });
    generateArchitectureCode(
      tagId,
      modalState.parentElId!,
      {
        ...modalState,
      },
      {
        onSuccess: ({ message }: { message: Blueprint }) => {
          const { new_id } = message;
          const TranspiledComponent = transpileJSX(message);
          updateBlueprint(new_id, message, TranspiledComponent);
        },
      }
    );
  };

  const { radioType } = modalState;

  return (
    <>
      <div onClick={radioType === "0" ? add : insert}>확인</div>
    </>
  );
};

export default UISelectModalFooter;
