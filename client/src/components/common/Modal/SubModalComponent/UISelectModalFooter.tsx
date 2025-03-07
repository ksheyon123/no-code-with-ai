import { useBlueprintContext } from "@/contexts/BlueprintContext";
import { useModalContext } from "@/contexts/ModalContext";
import { BluePrintObject } from "@/types";
import { createRandomHash } from "@/utils/crypto";

const UISelectModalFooter = () => {
  const { addBlueprint, insertBlueprint } = useBlueprintContext();
  const { modalState } = useModalContext();

  const add = () => {
    const d = modalState;
    console.log(d);
    const tagId = createRandomHash();
    addBlueprint(tagId, {
      ...d,
    });
  };

  const insert = () => {
    const d = modalState;
    insertBlueprint(d.id, {
      ...d,
    });
  };

  return (
    <>
      <div onClick={() => add()}>추가</div>
      <div onClick={insert}>삽입</div>
    </>
  );
};

export default UISelectModalFooter;
