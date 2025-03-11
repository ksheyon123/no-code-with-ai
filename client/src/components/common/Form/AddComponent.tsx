import Dropdown, { DropdownItem } from "@/components/common/Dropdown/Dropdown";
import { useModalContext } from "@/contexts/ModalContext";
import { createRandomHash } from "@/utils/crypto";
import { useEffect } from "react";
import Radio, { RadioGroup } from "../Radio";

const items: DropdownItem[] = [
  {
    id: "defaultwrapper",
    label: "Wrapper",
  },
  {
    id: "horizontal",
    label: "Horizontal",
  },
  {
    id: "vertical",
    label: "Vertical",
  },
  {
    id: "input",
    label: "Input",
  },
  {
    id: "button",
    label: "Button",
  },
  {
    id: "dropdown",
    label: "Dropdown",
  },
];

const AddComponent = ({ parentId, targetId }: any) => {
  const { modalState, setModalState } = useModalContext();
  useEffect(() => {
    setModalState((prev) => {
      return {
        ...prev,
        parentId,
        targetId,
        type: items[0].id,
      };
    });
  }, []);
  return (
    <div style={{ height: 400 }}>
      <div>
        <RadioGroup
          value={modalState.radioType}
          onChange={(val) => {
            setModalState((prev) => {
              return {
                ...prev,
                radioType: val,
              };
            });
          }}
          name="요소"
          children={[
            <Radio key="1" label="추가" name="추가" value="0" />,
            <Radio key="2" label="삽입" name="삽입" value="1" />,
          ]}
        />
      </div>
      <div>
        <label>Component Type</label>
        <Dropdown
          defaultValue={items[0].id}
          items={items}
          onClick={(e) => {
            const { id } = e;
            setModalState((prev) => {
              return {
                ...prev,
                type: id,
              };
            });
          }}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          value={modalState?.description || ""}
          onChange={(e) =>
            setModalState((prev) => {
              return {
                ...prev,
                description: e.target.value,
              };
            })
          }
        />
      </div>
      <div>
        <label>Style</label>
        <input
          value={modalState?.style || ""}
          onChange={(e) =>
            setModalState((prev) => {
              return {
                ...prev,
                style: e.target.value,
              };
            })
          }
        />
      </div>
    </div>
  );
};

export default AddComponent;
