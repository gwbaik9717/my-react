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
});
