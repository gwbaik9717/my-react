import { beforeEach, describe, expect, test } from "vitest";
import { React } from "../../src/lib/react";
import { render } from "../../src/lib/react/render";
import { createElement } from "../../src/lib/jsx/createElement";

describe("useState Unit Test", () => {
  beforeEach(() => {
    React.__reset();
  });

  const renderComponent = (Component) => {
    const virtualNode = createElement(Component, null);
    return render(virtualNode);
  };

  test("useState 함수의 인자로 state 의 초기값를 받고, state 와 state setter 함수로 이루어진 배열을 반환한다.", () => {
    const initialValue = 1;

    const Component = () => {
      const [state, setState] = React.useState(initialValue);

      expect(state).toBe(initialValue);
      expect(typeof setState).toBe("function");

      return initialValue;
    };

    const App = renderComponent(Component);
  });

  test("setter 함수는 parameter로 state에 할당할 새로운 값을 값을 받을 수 있고, state를 새로운 값으로 변경한다.", () => {
    const initialValue = 1;
    const newValue = 2;

    const Component = () => {
      const [state, setState] = React.useState(initialValue);

      if (state === initialValue) {
        setState(newValue);
      } else {
        expect(state).toBe(newValue);
      }

      return state;
    };

    // Initial render
    let App = renderComponent(Component);

    // Rerender Component
    App = renderComponent(Component);
  });

  test("setter 함수의 paramter로 function 이 전달되었을 때, function의 parameter로 이전 state 값을 받고, state를 function의 리턴값으로 변경한다.", () => {
    const initialValue = 1;
    const newValue = 2;

    const Component = () => {
      const [state, setState] = React.useState(initialValue);

      if (state === initialValue) {
        setState((prev) => {
          return prev + 1;
        });
      } else {
        expect(state).toBe(newValue);
      }

      return state;
    };

    // Render Component
    let App = renderComponent(Component);

    // Rerender Component
    App = renderComponent(Component);
  });

  test("여러 개의 useState 함수가 선언되었을 때 각각의 state 를 관리/변경할 수 있다.", () => {
    const initialValues = [1, "a"];
    const changedValues = [2, "ab"];

    const Component = () => {
      const [state1, setState1] = React.useState(initialValues[0]);
      const [state2, setState2] = React.useState(initialValues[1]);

      if (state1 === initialValues[0] && state2 === initialValues[1]) {
        setState1((prev) => prev + 1);
        setState2((prev) => prev + "b");
      } else {
        expect(state1).toBe(changedValues[0]);
        expect(state2).toBe(changedValues[1]);
      }

      return [state1, state2];
    };

    // Initial render
    let App = renderComponent(Component);

    // Rerender Component
    App = renderComponent(Component);
  });

  test("useState 는 동일한 렌더 내에서 여러 번 호출된 setState 를 처리한다.", () => {
    const initialValue = 1;
    const changedValue = 4;

    const Component = () => {
      const [state, setState] = React.useState(initialValue);

      if (state === initialValue) {
        setState((prev) => prev + 1);
        setState((prev) => prev + 2);
      } else {
        expect(state).toBe(changedValue);
      }

      return state;
    };

    // Initial render
    let App = renderComponent(Component);

    // Rerender Component
    App = renderComponent(Component);
  });
});
