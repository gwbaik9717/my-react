import { expect, test, describe } from "vitest";
import { createElement } from "../src/createElement";

describe("createElement Unit Test", () => {
  test("createElement 함수는 파라미터로 type, props, children(Optional)을 받고 반환값으로 type, props 라는 속성을 가진 객체를 반환한다.", () => {
    const type = "div";
    const props = null;

    const element = createElement(type, props);
    expect(element).toEqual({
      type,
      props: {},
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
});
