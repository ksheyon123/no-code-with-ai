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
    const tagId = createRandomHash();
    generateArchitectureCode(
      tagId,
      modalState.curElId!,
      {
        ...modalState,
      },
      {
        onSuccess: ({ message }: { message: Blueprint }) => {
          const { new_id, target_id } = message;
          initDomStructure(new_id, { children: [], siblings: [] });
          updateDomStructure(target_id, [new_id]);
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
