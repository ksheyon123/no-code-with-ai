import React from "react";

import List from "@/components/common/List/List";
import Drawer from "@/components/common/Drawer/Drawer";
import Dropdown from "@/components/common/Dropdown/Dropdown";

import { sampleListData, sampleDropdownData } from "@/constants/sample";

const UI: React.FC = () => {
  return (
    <div className="ui-page">
      <h1>UI 페이지</h1>
      <section>
        <h2>List</h2>
        <List items={sampleListData} />
      </section>

      <section>
        <h2>Drawer</h2>
        <Drawer title={"Open it!"} children={<div>Hello</div>} />
      </section>

      <section>
        <h2>Dropdown</h2>
        <Dropdown items={sampleDropdownData} onClick={() => {}} />
      </section>
    </div>
  );
};

export default UI;
