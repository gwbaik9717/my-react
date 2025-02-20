import { describe, test, expect } from "vitest";
import { render, createElement } from "../src/lib/jsx";

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
});
