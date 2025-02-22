import { describe, test, expect } from "vitest";
import { render, createElement, Fragment } from "../../src/lib/jsx";

describe("render Unit Test", () => {
  test("render 함수는 파라미터로 Virtual DOM 객체와 Dom 객체를 받아 실제 DOM 에 반영한다.", () => {
    const vdom = createElement(
      "div",
      { id: "app" },
      createElement("p", null, "Hello World")
    );

    document.body.innerHTML = `<div id="root"></div>`;
    const root = document.getElementById("root");

    render(vdom, root);

    expect(root.innerHTML).toBe('<div id="app"><p>Hello World</p></div>');
  });

  test("render 함수는 중첩된 Virtual DOM 객체를 올바르게 렌더링한다.", () => {
    const vdom = createElement(
      "div",
      null,
      createElement("h1", null, "Title"),
      createElement(
        "ul",
        null,
        createElement("li", null, "Item 1"),
        createElement("li", null, "Item 2")
      )
    );

    document.body.innerHTML = `<div id="root"></div>`;
    const root = document.getElementById("root");

    render(vdom, root);

    expect(root.innerHTML).toBe(
      "<div><h1>Title</h1><ul><li>Item 1</li><li>Item 2</li></ul></div>"
    );
  });

  test("render 함수는 props가 있는 Virtual DOM 객체를 올바르게 렌더링한다.", () => {
    const vdom = createElement("button", { class: "btn" }, "Click Me");

    document.body.innerHTML = `<div id="root"></div>`;
    const root = document.getElementById("root");

    render(vdom, root);

    expect(root.innerHTML).toBe('<button class="btn">Click Me</button>');
  });

  test.each([
    {
      description: "Fragment 안에 여러 요소들이 존재할 때",
      vdom: createElement(
        "div",
        null,
        Fragment({
          children: [
            createElement("h1", null, "Title"),
            createElement("p", null, "Paragraph"),
          ],
        })
      ),
      expected: "<div><h1>Title</h1><p>Paragraph</p></div>",
    },
    {
      description: "Fragment 안이 비어있을 때",
      vdom: createElement("div", null, Fragment({ children: [] })),
      expected: "<div></div>",
    },
  ])(
    "render 함수는 Framgent 를 올바르게 렌더링한다. (case: $description)",
    ({ vdom, expected }) => {
      document.body.innerHTML = `<div id="root"></div>`;
      const root = document.getElementById("root");

      render(vdom, root);

      expect(root.innerHTML).toBe(expected);
    }
  );

  test("render 함수는 빈 Virtual DOM 객체를 올바르게 렌더링한다.", () => {
    const vdom = createElement("div", null);

    document.body.innerHTML = `<div id="root"></div>`;
    const root = document.getElementById("root");

    render(vdom, root);

    expect(root.innerHTML).toBe("<div></div>");
  });

  test.each([
    {
      description: "Functional Component with no props",
      component: () =>
        createElement(() => createElement("div", null, "Functional Component")),
      expected: "<div>Functional Component</div>",
    },
    {
      description: "Functional Component with props",
      component: (props) =>
        createElement(
          (props) =>
            createElement("button", { class: props.class }, props.text),
          props
        ),
      props: { class: "btn", text: "Click Me" },
      expected: '<button class="btn">Click Me</button>',
    },
    {
      description: "Functional Component with children",
      component: (props) =>
        createElement(
          (props) =>
            createElement(
              "div",
              null,
              createElement("h1", null, props.title),
              createElement("p", null, props.content)
            ),
          props
        ),
      props: { title: "Title", content: "Content" },
      expected: "<div><h1>Title</h1><p>Content</p></div>",
    },
  ])(
    "render 함수는 Functional Component 를 올바르게 렌더링한다. (case: $description)",
    ({ component, props, expected }) => {
      const vdom = component(props);

      document.body.innerHTML = `<div id="root"></div>`;
      const root = document.getElementById("root");

      render(vdom, root);

      expect(root.innerHTML).toBe(expected);
    }
  );
});
