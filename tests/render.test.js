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
});
