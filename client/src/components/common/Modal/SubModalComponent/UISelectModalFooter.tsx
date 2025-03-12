import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";
import { ElementGenerationParams, Blueprint } from "@/types";
import { createRandomHash } from "@/utils/crypto";
import { generateArchitectureCode } from "@/workers/architectureWorkerManager";

const UISelectModalFooter = () => {
  const { updateBlueprint, initDomStructure, updateDomStructure } =
    useBlueprintContext();
  const { modalState } = useModalContext<ElementGenerationParams>();

  const add = () => {
    const { curElId } = modalState;
    console.log("parentElId : ", curElId);
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
          const { new_id, target_id } = message;
        },
      }
    );
  };

  return (
    <>
      <div onClick={add}>추가</div>
    </>
  );
};

export default UISelectModalFooter;
