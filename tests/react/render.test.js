import { describe, test, expect } from "vitest";
import { EffectTag, render } from "../../src/lib/react/render";
import { createElement } from "../../src/lib/jsx";

describe("render", () => {
  test("converts a simple virtual DOM element to a React element", () => {
    const virtualNode = createElement("div", { id: "test" }, "Hello World");

    const reactElement = render(virtualNode);

    expect(reactElement).toEqual({
      type: "div",
      props: { id: "test", children: ["Hello World"] },
      parent: null,
      domNode: null,
      effectTag: EffectTag.NoChange,
      memoizedState: null,
      children: [
        {
          type: "text",
          text: "Hello World",
          parent: expect.any(Object),
          domNode: null,
          effectTag: EffectTag.NoChange,
          children: null,
        },
      ],
    });
  });

  test("converts nested virtual DOM elements to React elements", () => {
    const virtualNode = createElement(
      "div",
      { id: "parent" },
      createElement("span", { class: "child" }, "Child Text")
    );
    const reactElement = render(virtualNode);

    expect(reactElement).toEqual({
      type: "div",
      props: { id: "parent", children: [expect.any(Object)] },
      parent: null,
      domNode: null,
      effectTag: EffectTag.NoChange,
      memoizedState: null,
      children: [
        {
          type: "span",
          props: { class: "child", children: ["Child Text"] },
          parent: expect.any(Object),
          domNode: null,
          effectTag: EffectTag.NoChange,
          memoizedState: null,
          children: [
            {
              type: "text",
              text: "Child Text",
              parent: expect.any(Object),
              domNode: null,
              effectTag: EffectTag.NoChange,
              children: null,
            },
          ],
        },
      ],
    });
  });

  test("converts a function component to a React element", () => {
    const FunctionComponent = (props) => {
      return createElement("h1", null, props.title);
    };

    const virtualNode = createElement(FunctionComponent, {
      title: "Hello from Component",
    });
    const reactElement = render(virtualNode);

    expect(reactElement).toEqual({
      type: "h1",
      props: { children: ["Hello from Component"] },
      parent: null,
      domNode: null,
      effectTag: EffectTag.NoChange,
      memoizedState: null,
      children: [
        {
          type: "text",
          text: "Hello from Component",
          parent: expect.any(Object),
          domNode: null,
          effectTag: EffectTag.NoChange,
          children: null,
        },
      ],
    });
  });

  test("converts a function component with children to a React element", () => {
    const FunctionComponent = (props) => {
      return createElement("div", { class: "wrapper" }, props.children);
    };

    const virtualNode = createElement(
      FunctionComponent,
      null,
      createElement("span", null, "Child 1"),
      createElement("span", null, "Child 2")
    );
    const reactElement = render(virtualNode);

    expect(reactElement).toEqual({
      type: "div",
      props: {
        class: "wrapper",
        children: [expect.any(Object), expect.any(Object)],
      },
      parent: null,
      domNode: null,
      effectTag: EffectTag.NoChange,
      memoizedState: null,
      children: [
        {
          type: "span",
          props: { children: ["Child 1"] },
          parent: expect.any(Object),
          domNode: null,
          effectTag: EffectTag.NoChange,
          memoizedState: null,
          children: [
            {
              type: "text",
              text: "Child 1",
              parent: expect.any(Object),
              domNode: null,
              effectTag: EffectTag.NoChange,
              children: null,
            },
          ],
        },
        {
          type: "span",
          props: { children: ["Child 2"] },
          parent: expect.any(Object),
          domNode: null,
          effectTag: EffectTag.NoChange,
          memoizedState: null,
          children: [
            {
              type: "text",
              text: "Child 2",
              parent: expect.any(Object),
              domNode: null,
              effectTag: EffectTag.NoChange,
              children: null,
            },
          ],
        },
      ],
    });
  });

  test("converts nested function components to React elements", () => {
    const ChildComponent = (props) => {
      return createElement("li", null, props.text);
    };

    const ParentComponent = () => {
      return createElement(
        "ul",
        { class: "list" },
        createElement(ChildComponent, { text: "Item 1" }),
        createElement(ChildComponent, { text: "Item 2" })
      );
    };

    const virtualNode = createElement(ParentComponent, null);
    const reactElement = render(virtualNode);

    expect(reactElement).toEqual({
      type: "ul",
      props: {
        class: "list",
        children: [expect.any(Object), expect.any(Object)],
      },
      parent: null,
      domNode: null,
      effectTag: EffectTag.NoChange,
      memoizedState: null,
      children: [
        {
          type: "li",
          props: { children: ["Item 1"] },
          parent: expect.any(Object),
          domNode: null,
          effectTag: EffectTag.NoChange,
          memoizedState: null,
          children: [
            {
              type: "text",
              text: "Item 1",
              parent: expect.any(Object),
              domNode: null,
              effectTag: EffectTag.NoChange,
              children: null,
            },
          ],
        },
        {
          type: "li",
          props: { children: ["Item 2"] },
          parent: expect.any(Object),
          domNode: null,
          effectTag: EffectTag.NoChange,
          memoizedState: null,
          children: [
            {
              type: "text",
              text: "Item 2",
              parent: expect.any(Object),
              domNode: null,
              effectTag: EffectTag.NoChange,
              children: null,
            },
          ],
        },
      ],
    });
  });

  test("handles function component returning null", () => {
    const EmptyComponent = () => null;
    const virtualNode = createElement(
      "div",
      null,
      createElement(EmptyComponent, null),
      "Text content"
    );
    const reactElement = render(virtualNode);

    expect(reactElement).toEqual({
      type: "div",
      props: { children: [expect.any(Object), "Text content"] },
      parent: null,
      domNode: null,
      effectTag: EffectTag.NoChange,
      memoizedState: null,
      children: [
        {
          type: "text",
          text: "Text content",
          parent: expect.any(Object),
          domNode: null,
          effectTag: EffectTag.NoChange,
          children: null,
        },
      ],
    });
  });
});
