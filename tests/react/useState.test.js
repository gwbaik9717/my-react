import { describe, expect, test } from "vitest";
import { React } from "../../src/lib/react";

describe("useState Unit Test", () => {
  test("useState 함수의 인자로 state 의 초기값를 받고, state 와 state setter 함수로 이루어진 배열을 반환한다.", () => {
    const initialValue = 1;

    const Component = () => {
      const result = React.useState(initialValue);

      return result;
    };

    // Render Component
    const result = Component();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(typeof result[1]).toBe("function");
  });

  test("state 의 초기 값은 useState 의 parameter 로 전달된 initialValue 이다.", () => {
    const initialValue = 1;

    const Component = () => {
      const [state, setState] = React.useState(initialValue);

      return state;
    };

    // Render Component
    const result = Component();

    expect(result).toBe(initialValue);
  });
});
