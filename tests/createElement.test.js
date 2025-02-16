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
          children: [
            { type: "span", props: {} },
            { type: "a", props: {} },
          ],
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
    "creatElement의 children parameter에 배열로 넘길 수 있다. (case: %s)",
    (_, element, expected) => {
      expect(element).toEqual(expected);
    }
  );
  test.each([
    [
      "boolean values as direct children",
      createElement("div", null, false, createElement("span", null), true),
      {
        type: "div",
        props: {
          children: [{ type: "span", props: {} }],
        },
      },
    ],
    [
      "boolean values inside an array",
      createElement("div", null, [false, createElement("span", null), true]),
      {
        type: "div",
        props: {
          children: [{ type: "span", props: {} }],
        },
      },
    ],
    [
      "boolean values in nested arrays",
      createElement("div", null, [
        [false, createElement("span", null)],
        [true, createElement("a", null)],
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
      "only boolean values",
      createElement("div", null, false, true),
      {
        type: "div",
        props: {},
      },
    ],
    [
      "boolean values mixed with valid elements",
      createElement(
        "div",
        null,
        false,
        createElement("p", null, "Hello"),
        true
      ),
      {
        type: "div",
        props: {
          children: [{ type: "p", props: { children: ["Hello"] } }],
        },
      },
    ],
  ])(
    "createElement의 children parameter에 Boolean 값이 들어간다면 무시한다. (case: %s)",
    (_, element, expected) => {
      expect(element).toEqual(expected);
    }
  );

  test.each([
    [
      "simple function component",
      (() => {
        const Component = () => {
          return createElement("span", null, "Child");
        };

        return createElement("div", null, createElement(Component, null));
      })(),
      {
        type: "div",
        props: {
          children: [
            {
              type: "span",
              props: {
                children: ["Child"],
              },
            },
          ],
        },
      },
    ],
    [
      "nested function components",
      (() => {
        const InnerComponent = () => {
          return createElement("b", null, "Bold");
        };

        const OuterComponent = () => {
          return createElement("p", null, createElement(InnerComponent, null));
        };

        return createElement("div", null, createElement(OuterComponent, null));
      })(),
      {
        type: "div",
        props: {
          children: [
            {
              type: "p",
              props: {
                children: [
                  {
                    type: "b",
                    props: {
                      children: ["Bold"],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
    [
      "function component without children",
      (() => {
        const Component = () => {
          return createElement("hr", null);
        };

        return createElement("div", null, createElement(Component, null));
      })(),
      {
        type: "div",
        props: {
          children: [
            {
              type: "hr",
              props: {},
            },
          ],
        },
      },
    ],
    [
      "function component returning null",
      (() => {
        const Component = () => null;

        return createElement("div", null, createElement(Component, null));
      })(),
      {
        type: "div",
        props: {}, // No children since it returns null
      },
    ],
  ])(
    "createElement의 type parameter에 Function Component 를 수용할 수 있다. (case: %s)",
    (_, element, expected) => {
      expect(element).toEqual(expected);
    }
  );
});
