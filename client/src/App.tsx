import React from "react";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Webpack + TypeScript</h1>
        <p>
          절대 경로 예시: <code>@/components</code>를 사용하여 컴포넌트를
          임포트할 수 있습니다.
        </p>
      </header>
    </div>
  );
};

export default App;
