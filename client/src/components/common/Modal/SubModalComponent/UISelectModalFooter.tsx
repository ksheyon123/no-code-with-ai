import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";
import { BluePrintObject } from "@/types";
import { createRandomHash } from "@/utils/crypto";

const UISelectModalFooter = () => {
  const { addBlueprint, updateBlueprint } = useBlueprintContext();
  const { modalState } = useModalContext();

  const add = () => {
    const d = modalState as BluePrintObject;
    const tagId = createRandomHash();
    addBlueprint(tagId, {
      ...d,
    });
  };

  const update = () => {
    const d = modalState as BluePrintObject;
    updateBlueprint(d.id, {
      ...d,
    });
  };

  return (
    <>
      <div onClick={add}>추가</div>
      <div onClick={update}>수정</div>
    </>
  );
};

export default UISelectModalFooter;
