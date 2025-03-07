import Dropdown, { DropdownItem } from "@/components/common/Dropdown/Dropdown";
import { useModalContext } from "@/contexts/ModalContext";
import { createRandomHash } from "@/utils/crypto";
import { useEffect } from "react";

const items: DropdownItem[] = [
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

const AddComponent = ({ targetId }: any) => {
  const { modalState, setModalState } = useModalContext();
  useEffect(() => {
    setModalState((prev) => {
      return {
        ...prev,
        type: items[0].id,
      };
    });
  }, []);
  return (
    <div>
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
