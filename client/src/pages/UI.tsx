import React from "react";
import { FaReact } from "react-icons/fa";

const UI: React.FC = () => {
  return (
    <div className="ui-page">
      <h1>UI 페이지</h1>
      <div className="icon-container">
        <FaReact size={50} color="#61DAFB" />
        <p>React Icons 예시</p>
      </div>
    </div>
  );
};

export default UI;
