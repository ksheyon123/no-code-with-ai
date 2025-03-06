import React, { RefObject, useEffect, useRef } from "react";

import List from "@/components/common/List/List";
import Drawer from "@/components/common/Drawer/Drawer";
import Dropdown from "@/components/common/Dropdown/Dropdown";

import { sampleListData, sampleDropdownData } from "@/constants/sample";
import InputWrapper from "@/components/common/Input/InputWrapper";
import Input from "@/components/common/Input/Input";
import { useModalContext } from "@/contexts/ModalContext";
import AddComponent from "@/components/common/Form/AddComponent";

const UI: React.FC = () => {
  const { openModal } = useModalContext();
  const divRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const onClick = () => {
      openModal([<AddComponent />, <div>Hi</div>], <></>, <div>확인</div>, {
        useFooter: true,
        useHeader: false,
        showNavigationButtons: true,
      });
    };
    if (divRef.current) {
      divRef.current!.addEventListener("click", onClick);
    }
    return () => {
      if (divRef.current) {
        divRef.current!.removeEventListener("click", onClick);
      }
    };
  }, [divRef]);

  return (
    <div className="ui-page">
      <h1>UI 페이지</h1>
      <section>
        <h2>Drawer</h2>
        <Drawer title={"Open it!"} children={<div>Hello</div>} />
      </section>

      <section>
        <h2>Dropdown</h2>
        <Dropdown items={sampleDropdownData} onClick={() => {}} />
      </section>

      <section>
        <h2>Input</h2>
        <InputWrapper>
          <Input />
        </InputWrapper>
      </section>

      <section>
        <h2>Open Modal</h2>
        <div ref={divRef as RefObject<HTMLDivElement>}>Click</div>
      </section>
    </div>
  );
};

export default UI;
