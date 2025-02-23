import { expect, test, describe } from "vitest";
import { createElement, normalizeRenderableChild } from "../../src/lib/jsx";

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

  test.each(
    [
      "function component with props",
      (() => {
        const Component = (props) => {
          return createElement("span", null, props.text);
        };

        return createElement(
          "div",
          null,
          createElement(Component, { text: "Hello" })
        );
      })(),
      {
        type: "div",
        props: {
          children: [
            {
              type: "span",
              props: {
                children: "Hello",
              },
            },
          ],
        },
      },
    ],
    [
      "function component with multiple props",
      (() => {
        const Component = (props) => {
          return createElement("p", { className: props.className }, props.text);
        };

        return createElement(
          "div",
          null,
          createElement(Component, { text: "Hello", className: "greeting" })
        );
      })(),
      {
        type: "div",
        props: {
          children: {
            type: "p",
            props: {
              className: "greeting",
              children: "Hello",
            },
          },
        },
      },
    ],
    [
      "function component with nested function component using props",
      (() => {
        const Child = (props) => {
          return createElement("b", null, props.content);
        };

        const Parent = (props) => {
          return createElement(
            "p",
            null,
            createElement(Child, { content: props.text })
          );
        };

        return createElement(
          "div",
          null,
          createElement(Parent, { text: "Bold Text" })
        );
      })(),
      {
        type: "div",
        props: {
          children: {
            type: "p",
            props: {
              children: {
                type: "b",
                props: {
                  children: "Bold Text",
                },
              },
            },
          },
        },
      },
    ]
  )(
    "createElement의 type parameter Function Component 에 props 를 전달할 수 있다. (case: %s)",
    (_, element, expected) => {
      expect(element).toEqual(expected);
    }
  );

  test.each([
    [
      "simple function component with children",
      (() => {
        const Component = (props) => {
          expect(props.children).toEqual([
            {
              type: "span",
              props: {
                children: ["Hello"],
              },
            },
          ]);

          return createElement("span", null);
        };

        return createElement(
          "div",
          null,
          createElement(Component, null, createElement("span", null, "Hello"))
        );
      })(),
      {
        type: "div",
        props: {
          children: [
            {
              type: "span",
              props: {},
            },
          ],
        },
      },
    ],
    [
      "function component with multiple children",
      (() => {
        const Component = (props) => {
          expect(props.children).toEqual([
            {
              type: "b",
              props: {
                children: ["Bold"],
              },
            },
            {
              type: "i",
              props: {
                children: ["Italic"],
              },
            },
          ]);

          return createElement("div", null);
        };

        return createElement(
          "div",
          null,
          createElement(
            Component,
            null,
            createElement("b", null, "Bold"),
            createElement("i", null, "Italic")
          )
        );
      })(),
      {
        type: "div",
        props: {
          children: [
            {
              type: "div",
              props: {},
            },
          ],
        },
      },
    ],
    [
      "function component with nested children",
      (() => {
        const Component = (props) => {
          expect(props.children).toEqual([
            {
              type: "ul",
              props: {
                children: [
                  {
                    type: "li",
                    props: {
                      children: ["Item 1"],
                    },
                  },
                  {
                    type: "li",
                    props: {
                      children: ["Item 2"],
                    },
                  },
                ],
              },
            },
          ]);

          return createElement("section", null);
        };

        return createElement(
          "div",
          null,
          createElement(
            Component,
            null,
            createElement(
              "ul",
              null,
              createElement("li", null, "Item 1"),
              createElement("li", null, "Item 2")
            )
          )
        );
      })(),
      {
        type: "div",
        props: {
          children: [
            {
              type: "section",
              props: {},
            },
          ],
        },
      },
    ],
    [
      "function component receiving null children",
      (() => {
        const Component = (props) => {
          expect(props.children).toBeUndefined();

          return createElement("span", null);
        };

        return createElement("div", null, createElement(Component, null));
      })(),
      {
        type: "div",
        props: {
          children: [
            {
              type: "span",
              props: {},
            },
          ],
        },
      },
    ],
  ])(
    "createElement 의 type parameter가 Function Component이고, Function Component 의 children 이 존재할 때 props.children 으로 Function Component 내부에서 children 을 접근할 수 있다. (case: %s)",
    (_, element, expected) => {
      expect(element).toEqual(expected);
    }
  );

  test.each([
    [
      "숫자와 다른 타입의 자식 요소를 함께 포함할 수 있다.",
      createElement("div", null, 123, createElement("span", null, "Hello")),
      {
        type: "div",
        props: {
          children: [
            "123",
            {
              type: "span",
              props: {
                children: ["Hello"],
              },
            },
          ],
        },
      },
    ],
    [
      "숫자가 포함된 배열을 자식 요소로 포함할 수 있다.",
      createElement("div", null, [123, createElement("span", null, "Hello")]),
      {
        type: "div",
        props: {
          children: [
            "123",
            {
              type: "span",
              props: {
                children: ["Hello"],
              },
            },
          ],
        },
      },
    ],
  ])(
    "createElement 함수는 숫자를 stringify 한다. (case: %s)",
    (_, element, expected) => {
      expect(element).toEqual(expected);
    }
  );
});
