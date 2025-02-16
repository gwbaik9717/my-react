import { expect, test, describe } from "vitest";
import { createElement } from "../src/createElement";

describe("createElement Unit Test", () => {
  test("createElement 함수는 파라미터로 type, props, children(Optional)을 받고 반환값으로 type, props 라는 속성을 가진 객체를 반환한다.", () => {
    const element = createElement("div", null);

    expect(element).toEqual({
      type: "div",
      props: {},
    });
  });

  test("createElement 함수에 props 를 전달하면, 리턴 값의 props 속성에 props 들이 존재한다.", () => {
    const type = "div";
    const id = "container";
    const className = "flex";

    const element = createElement(type, {
      id,
      className,
    });

    expect(element).toEqual({
      type,
      props: {
        id,
        className,
      },
    });
  });

  test("중첩된 태그의 경우, 부모 객체의 props 내 children 속성에 자식 요소가 배열 형태로 포함되어야 한다.", () => {
    const element = createElement("div", null, createElement("span", null));

    expect(element).toEqual({
      type: "div",
      props: {
        children: [
          {
            type: "span",
            props: {},
          },
        ],
      },
    });
  });

  test.each([
    [
      "array with multiple elements",
      createElement("div", null, [
        createElement("span", null),
        createElement("a", null),
      ]),
      {
        type: "div",
        props: {
          children: [
            { type: "span", props: {} },
            { type: "a", props: {} },
          ],
        },
      },
    ],
    [
      "array with multiple elements and non-array item",
      createElement(
        "div",
        null,
        [createElement("span", null), createElement("a", null)],
        createElement("span", null)
      ),
      {
        type: "div",
        props: {
          children: [
            { type: "span", props: {} },
            { type: "a", props: {} },
            { type: "span", props: {} },
          ],
        },
      },
    ],
    [
      "nested arrays as children",
      createElement("div", null, [
        [createElement("span", null)],
        [createElement("a", null)],
      ]),
      {
        type: "div",
        props: {
          children: [[{ type: "span", props: {} }], [{ type: "a", props: {} }]],
        },
      },
    ],
    [
      "empty array as children",
      createElement("div", null, []),
      {
        type: "div",
        props: {},
      },
    ],
  ])(
    "creatElement 의 children parameter 에 배열로 넘길 수 있다. (case: %s)",
    (_, element, expected) => {
      expect(element).toEqual(expected);
    }
  );
});
