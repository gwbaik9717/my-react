import { beforeEach, describe, expect, test } from "vitest";
import { React } from "../../src/lib/react";

describe("useState Unitw Test", () => {
  beforeEach(() => {
    React.__reset();
  });

  const render = (Component) => {
    React.__prepareForRender(Component);
    return Component();
  };

  test("useState 함수의 인자로 state 의 초기값를 받고, state 와 state setter 함수로 이루어진 배열을 반환한다.", () => {
    const initialValue = 1;

    const Component = () => {
      const result = React.useState(initialValue);

      return {
        render: () => result,
      };
    };

    // Render Component
    const App = render(Component);
    const result = App.render();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(typeof result[1]).toBe("function");
  });

  test("state 의 초기 값은 useState 의 parameter 로 전달된 initialValue 이다.", () => {
    const initialValue = 1;

    const Component = () => {
      const [state, setState] = React.useState(initialValue);

      return {
        render: () => state,
      };
    };

    // Render Component
    const App = render(Component);
    const result = App.render();

    expect(result).toBe(initialValue);
  });

  test("setter 함수는 parameter로 state에 할당할 새로운 값을 값을 받을 수 있고, state를 새로운 값으로 변경한다.", () => {
    const initialValue = 1;
    const newValue = 2;

    const Component = () => {
      const [state, setState] = React.useState(initialValue);

      return {
        render: () => state,
        click: () => {
          setState(newValue);
        },
      };
    };

    // Render Component
    let App = render(Component);

    // state 변경
    App.click();

    // Rerender Component
    App = render(Component);

    const state = App.render();
    expect(state).toBe(newValue);
  });

  test("setter 함수의 paramter로 function 이 전달되었을 때, function의 parameter로 이전 state 값을 받고, state를 function의 리턴값으로 변경한다.", () => {
    const initialValue = 1;
    const newValue = 2;

    const Component = () => {
      const [state, setState] = React.useState(initialValue);

      return {
        render: () => state,
        click: () => {
          setState((prev) => {
            return prev + 1;
          });
        },
      };
    };

    // Render Component
    let App = render(Component);

    // state 변경
    App.click();

    // Rerender Component
    App = render(Component);
    const state = App.render();
    expect(state).toBe(newValue);
  });

  test("여러 개의 useState 함수가 선언되었을 때 각각의 state 를 관리/변경할 수 있다.", () => {
    const initialValues = [1, "a"];
    const changedValues = [2, "ab"];

    const Component = () => {
      const [state1, setState1] = React.useState(initialValues[0]);
      const [state2, setState2] = React.useState(initialValues[1]);

      return {
        click: () => {
          setState1((prev) => prev + 1);
          setState2((prev) => prev + "b");
        },
        render: () => [state1, state2],
      };
    };

    let App = render(Component);
    const initialState = App.render();
    expect(initialState).toEqual(initialValues);

    // state 1 증가
    App.click();

    App = render(Component);
    const changedState = App.render();
    expect(changedState).toEqual(changedValues);
  });

  test("useState 는 동일한 렌더 내에서 여러 번 호출된 setState 를 처리한다.", () => {
    const initialValue = 1;
    const changedValue = 4;

    const Component = () => {
      const [state, setState] = React.useState(initialValue);

      return {
        render: () => state,
        click: () => {
          setState((prev) => {
            return prev + 1;
          });
          setState((prev) => {
            return prev + 2;
          });
        },
      };
    };

    let App = render(Component);
    const initialState = App.render();
    expect(initialState).toEqual(initialValue);

    // setState 가 동일한 렌더 내에 여러 번 변경
    App.click();

    App = render(Component);
    const changedState = App.render();
    expect(changedState).toEqual(changedValue);
  });

  test("useState 는 서로 다른 컴포넌트에서 독립적인 상태를 관리한다.", () => {
    const Component1 = () => {
      const [state, setState] = React.useState(1);
      return {
        render: () => state,
        click: () => setState((prev) => prev + 1),
      };
    };

    const Component2 = () => {
      const [state, setState] = React.useState("a");
      return {
        render: () => state,
        click: () => setState((prev) => prev + "b"),
      };
    };

    let App1 = render(Component1);
    let App2 = render(Component2);

    expect(App1.render()).toBe(1);
    expect(App2.render()).toBe("a");

    App1.click();
    App1 = render(Component1);

    expect(App1.render()).toBe(2);
    expect(App2.render()).toBe("a");

    App2.click();
    App2 = render(Component2);

    expect(App1.render()).toBe(2);
    expect(App2.render()).toBe("ab");
  });
});
