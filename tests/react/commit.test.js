import { describe, test, expect, vi, beforeEach } from "vitest";
import { EffectTag, render } from "../../src/lib/react/render";
import { commitRoot, commitWork } from "../../src/lib/react/commit";
import { createElement } from "../../src/lib/jsx";

describe("commit", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  test("commits initial render to the DOM", () => {
    const virtualNode = createElement("div", { id: "test" }, "Hello World");
    const reactElement = render(virtualNode);

    const root = { domNode: container, current: reactElement, wip: null };
    commitRoot(root);

    expect(container.innerHTML).toBe('<div id="test">Hello World</div>');
  });

  test("commits updates to the DOM", () => {
    const initialVirtualNode = createElement(
      "div",
      { id: "test" },
      "Hello World"
    );
    const initialReactElement = render(initialVirtualNode);

    const root = { domNode: container, current: initialReactElement };
    commitRoot(root);

    const updatedVirtualNode = createElement(
      "div",
      { id: "test", class: "updated" },
      "Hello World"
    );
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);
    updatedReactElement.effectTag = EffectTag.Update;

    root.wip = updatedReactElement;
    commitRoot(root);

    expect(container.innerHTML).toBe(
      '<div id="test" class="updated">Hello World</div>'
    );
  });

  test("commits deletions to the DOM", () => {
    const initialVirtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const initialReactElement = render(initialVirtualNode);

    const root = { domNode: container, current: initialReactElement };
    commitRoot(root);

    const updatedVirtualNode = createElement("div", { id: "parent" });
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);

    initialReactElement.child.effectTag = EffectTag.Deletion;

    root.wip = updatedReactElement;
    commitRoot(root);

    expect(container.innerHTML).toBe('<div id="parent"></div>');
  });

  test("commits placements to the DOM", () => {
    const initialVirtualNode = createElement("div", { id: "parent" });
    const initialReactElement = render(initialVirtualNode);

    const root = { domNode: container, current: initialReactElement };
    commitRoot(root);

    const updatedVirtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);
    updatedReactElement.child.effectTag = EffectTag.Placement;

    root.wip = updatedReactElement;
    commitRoot(root);

    expect(container.innerHTML).toBe(
      '<div id="parent"><span class="child">Child Text</span></div>'
    );
  });

  test("commits nested updates to the DOM", () => {
    const initialVirtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const initialReactElement = render(initialVirtualNode);

    const root = { domNode: container, current: initialReactElement };
    commitRoot(root);

    const updatedVirtualNode = createElement(
      "div",
      { id: "parent", class: "updated" },
      createElement("span", { class: "child" }, "Updated Child Text")
    );
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);
    updatedReactElement.effectTag = EffectTag.Update;
    updatedReactElement.child.child.effectTag = EffectTag.Update;

    root.wip = updatedReactElement;
    commitRoot(root);

    expect(container.innerHTML).toBe(
      '<div id="parent" class="updated"><span class="child">Updated Child Text</span></div>'
    );
  });

  test("commits nested deletions to the DOM", () => {
    const initialVirtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const initialReactElement = render(initialVirtualNode);

    const root = { domNode: container, current: initialReactElement };
    commitRoot(root);

    const updatedVirtualNode = createElement("div", { id: "parent" });
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);
    initialReactElement.child.effectTag = EffectTag.Deletion;

    root.wip = updatedReactElement;
    commitRoot(root);

    expect(container.innerHTML).toBe('<div id="parent"></div>');
  });

  test("commits nested placements to the DOM", () => {
    const initialVirtualNode = createElement("div", { id: "parent" });
    const initialReactElement = render(initialVirtualNode);

    const root = { domNode: container, current: initialReactElement };
    commitRoot(root);

    const updatedVirtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);
    updatedReactElement.child.effectTag = EffectTag.Placement;

    root.current = updatedReactElement;
    commitRoot(root);

    expect(container.innerHTML).toBe(
      '<div id="parent"><span class="child">Child Text</span></div>'
    );
  });
});
