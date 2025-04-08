import { describe, test, expect } from "vitest";
import { EffectTag, render } from "../../src/lib/react/render";
import { reconcile } from "../../src/lib/react/reconcile";
import { createElement } from "../../src/lib/jsx";

describe("reconcile", () => {
  test("marks elements for update when props change", () => {
    const initialVirtualNode = createElement(
      "div",
      { id: "test" },
      "Hello World"
    );
    const initialReactElement = render(initialVirtualNode);

    const updatedVirtualNode = createElement(
      "div",
      { id: "test", class: "updated" },
      "Hello World"
    );
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);

    reconcile(updatedReactElement, initialReactElement);

    expect(updatedReactElement.effectTag).toBe(EffectTag.Update);
  });

  test("marks elements for deletion when they are removed", () => {
    const initialVirtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const initialReactElement = render(initialVirtualNode);

    const updatedVirtualNode = createElement("div", { id: "parent" });
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);

    reconcile(updatedReactElement, initialReactElement);

    expect(initialReactElement.child.effectTag).toBe(EffectTag.Deletion);
  });

  test("marks elements for placement when they are added", () => {
    const initialVirtualNode = createElement("div", { id: "parent" });
    const initialReactElement = render(initialVirtualNode);

    const updatedVirtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);

    reconcile(updatedReactElement, initialReactElement);

    expect(updatedReactElement.child.effectTag).toBe(EffectTag.Placement);
  });

  test("handles nested updates correctly", () => {
    const initialVirtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const initialReactElement = render(initialVirtualNode);

    const updatedVirtualNode = createElement(
      "div",
      { id: "parent", class: "updated" },
      createElement("span", { class: "child" }, "Updated Child Text")
    );
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);

    reconcile(updatedReactElement, initialReactElement);

    expect(updatedReactElement.child.child.effectTag).toBe(EffectTag.Update);
    expect(updatedReactElement.child.child.text).toBe("Updated Child Text");
  });

  test("handles nested deletions correctly", () => {
    const initialVirtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const initialReactElement = render(initialVirtualNode);

    const updatedVirtualNode = createElement("div", { id: "parent" });
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);

    reconcile(updatedReactElement, initialReactElement);

    expect(initialReactElement.child.effectTag).toBe(EffectTag.Deletion);
  });

  test("handles nested placements correctly", () => {
    const initialVirtualNode = createElement("div", { id: "parent" });
    const initialReactElement = render(initialVirtualNode);

    const updatedVirtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const updatedReactElement = render(updatedVirtualNode, initialReactElement);

    reconcile(updatedReactElement, initialReactElement);

    expect(updatedReactElement.child.effectTag).toBe(EffectTag.Placement);
  });
});
