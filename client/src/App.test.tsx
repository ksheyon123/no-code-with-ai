import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App 컴포넌트", () => {
  test("렌더링이 정상적으로 되는지 확인", () => {
    const { container } = render(<App />);
    const appElement = container.getElementsByClassName("app")[0];
    expect(appElement).toBeInTheDocument();
  });
});
