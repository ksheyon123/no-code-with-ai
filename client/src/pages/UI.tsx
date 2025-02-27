import React from "react";

import List from "@/components/common/List/List";
import { sampleListData } from "@/constants/sample";

const UI: React.FC = () => {
  return (
    <div className="ui-page">
      <h1>UI 페이지</h1>
      <section>
        <List items={sampleListData} />
      </section>
    </div>
  );
};

export default UI;
