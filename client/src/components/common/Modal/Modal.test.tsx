import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "./Modal";
import { ModalContextProvider } from "@/contexts/ModalContext";

// 테스트를 위한 래퍼 컴포넌트
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ModalContextProvider>{children}</ModalContextProvider>;
};

describe("Modal Component", () => {
  // 기본 렌더링 테스트
  test("renders modal when isOpen is true", () => {
    const handleClose = jest.fn();

    render(
      <TestWrapper>
        <Modal isOpen={true} onClose={handleClose}>
          <Modal.Backdrop onClick={handleClose} />
          <Modal.Content>모달 내용</Modal.Content>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText("모달 내용")).toBeInTheDocument();
    expect(screen.getByTestId("modal-backdrop")).toBeInTheDocument();
  });

  // 모달이 닫혀있을 때 렌더링되지 않는지 테스트
  test("does not render modal when isOpen is false", () => {
    const handleClose = jest.fn();

    render(
      <TestWrapper>
        <Modal isOpen={false} onClose={handleClose}>
          <Modal.Content>모달 내용</Modal.Content>
        </Modal>
      </TestWrapper>
    );

    expect(screen.queryByText("모달 내용")).not.toBeInTheDocument();
  });

  // 백드롭 클릭 시 onClose 호출 테스트
  test("calls onClose when backdrop is clicked", () => {
    const handleClose = jest.fn();

    render(
      <TestWrapper>
        <Modal isOpen={true} onClose={handleClose}>
          <Modal.Backdrop onClick={handleClose} />
          <Modal.Content>모달 내용</Modal.Content>
        </Modal>
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId("modal-backdrop"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // 모달 헤더 렌더링 테스트
  test("renders modal header correctly", () => {
    const handleClose = jest.fn();

    render(
      <TestWrapper>
        <Modal isOpen={true} onClose={handleClose}>
          <Modal.Header>모달 제목</Modal.Header>
          <Modal.Content>모달 내용</Modal.Content>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText("모달 제목")).toBeInTheDocument();
    expect(screen.getByTestId("modal-header")).toBeInTheDocument();
  });

  // 모달 푸터 렌더링 테스트
  test("renders modal footer correctly", () => {
    const handleClose = jest.fn();

    render(
      <TestWrapper>
        <Modal isOpen={true} onClose={handleClose}>
          <Modal.Content>모달 내용</Modal.Content>
          <Modal.Footer>
            <button>확인</button>
          </Modal.Footer>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText("확인")).toBeInTheDocument();
    expect(screen.getByTestId("modal-footer")).toBeInTheDocument();
  });

  // 함수형 자식 컴포넌트 테스트 (Content)
  test("renders function as child in Content component", () => {
    const handleClose = jest.fn();

    render(
      <TestWrapper>
        <Modal isOpen={true} onClose={handleClose}>
          <Modal.Content>
            {(state, setState) => {
              return (
                <div>
                  <button
                    onClick={() => setState({ count: (state.count || 0) + 1 })}
                  >
                    증가
                  </button>
                  <span>카운트: {state.count || 0}</span>
                </div>
              );
            }}
          </Modal.Content>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText("카운트: 0")).toBeInTheDocument();

    fireEvent.click(screen.getByText("증가"));
    expect(screen.getByText("카운트: 1")).toBeInTheDocument();
  });

  // 함수형 자식 컴포넌트 테스트 (Footer)
  test("renders function as child in Footer component", () => {
    const handleClose = jest.fn();

    render(
      <TestWrapper>
        <Modal isOpen={true} onClose={handleClose}>
          <Modal.Content>
            {(state, setState) => (
              <button onClick={() => setState({ confirmed: true })}>
                확인하기
              </button>
            )}
          </Modal.Content>
          <Modal.Footer>
            {(state) => <button disabled={!state.confirmed}>제출</button>}
          </Modal.Footer>
        </Modal>
      </TestWrapper>
    );

    const submitButton = screen.getByText("제출");
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByText("확인하기"));
    expect(submitButton).not.toBeDisabled();
  });
});
