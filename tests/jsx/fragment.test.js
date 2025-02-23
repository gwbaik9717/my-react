import { expect, test, describe } from "vitest";
import { Fragment } from "../../src/lib/jsx";
import { createElement } from "../../src/lib/jsx";

describe("Fragment Unit Test", () => {
  test("Fragment는 자식 요소들을 배열로 반환한다.", () => {
    const fragment = Fragment({
      children: [
        createElement("h1", null, "Title"),
        createElement("p", null, "Paragraph"),
      ],
    });

    expect(fragment).toEqual([
      {
        type: "h1",
        props: {
          children: ["Title"],
        },
      },
      {
        type: "p",
        props: {
          children: ["Paragraph"],
        },
      },
    ]);
  });

  test("Fragment는 빈 배열을 반환할 수 있다.", () => {
    const fragment = Fragment({});

    expect(fragment).toEqual([]);
  });

  test("Fragment는 중첩된 자식 요소들을 배열로 반환한다.", () => {
    const fragment = Fragment({
      children: [
        createElement("div", null, createElement("span", null, "Nested")),
      ],
    });

    expect(fragment).toEqual([
      {
        type: "div",
        props: {
          children: [
            {
              type: "span",
              props: {
                children: ["Nested"],
              },
            },
          ],
        },
      },
    ]);
  });
});
