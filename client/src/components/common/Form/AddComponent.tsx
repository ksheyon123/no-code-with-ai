import Dropdown from "@/components/common/Dropdown/Dropdown";
import { useModalContext } from "@/contexts/ModalContext";
import { ReactNode, useEffect } from "react";
import Radio, { RadioGroup } from "../Radio";
import { dropdownItems } from "@/constants";
import InputWrapper from "@/components/common/Input/InputWrapper";
import Input from "@/components/common/Input/Input";
import TextArea from "@/components/common/TextArea/Textarea";

interface WrapperProps {
  children: ReactNode;
  label: string;
}

const Wrapper: React.FC<WrapperProps> = ({ label, children }) => {
  return (
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
    >
      <div style={{ width: "120px" }}>{label}</div>
      <div style={{ flex: "1 1 0%" }}>{children}</div>
    </div>
  );
};

const AddComponent = ({ parentId, targetId }: any) => {
  const { modalState, setModalState } = useModalContext();
  useEffect(() => {
    setModalState((prev) => {
      return {
        ...prev,
        parentId,
        targetId,
        type: dropdownItems[0].id,
      };
    });
  }, []);
  return (
    <div style={{ minHeight: 400 }}>
      <Wrapper label="요소">
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
      </Wrapper>
      <Wrapper label="Component Type">
        <Dropdown
          defaultValue={dropdownItems[0].id}
          items={dropdownItems}
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
      </Wrapper>
      <Wrapper label="Description">
        <InputWrapper>
          <TextArea type="text" />
        </InputWrapper>
      </Wrapper>
      <Wrapper label="Style">
        <InputWrapper>
          <TextArea type="text" />
        </InputWrapper>
      </Wrapper>
    </div>
  );
};

export default AddComponent;
