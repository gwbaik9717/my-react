/**
 * 주어진 자식을 평탄화하여 단일 배열로 반환합니다.
 *
 * @param {any} child - flatten할 자식 요소. 배열일 수도 있고, 일반 요소일 수도 있음.
 * @returns {Array} flatten된 자식 요소들의 배열.
 */
const flatten = (child) => {
  const result = [];

  if (Array.isArray(child)) {
    for (const item of child) {
      const flattened = flatten(item);
      result.push(...flattened);
    }

    return result;
  }

  if (isRenderable(child)) {
    const normalizedChild = normalizeRenderableChild(child);
    result.push(normalizedChild);
  }

  return result;
};

/**
 * 주어진 자식 요소를 정규화하는 함수
 *
 * 자식 요소는 boolean 값(true 또는 false)이 아니고,
 * undefined 또는 null이 아닌 경우 렌더링 가능하다고 간주됩니다.
 *
 * @param {*} child - 정규화할 자식 요소.
 * @returns {*} - 정규화된 자식 요소.
 */
export const normalizeRenderableChild = (child) => {
  if (!isRenderable(child)) {
    throw new Error("Child is not renderable!");
  }

  if (typeof child === "number") {
    return child.toString();
  }

  return child;
};

/**
 * 주어진 자식 요소가 렌더링 가능한지 확인하는 함수
 *
 * 자식 요소는 boolean 값(true 또는 false)이 아니고,
 * undefined 또는 null이 아닌 경우 렌더링 가능하다고 간주됩니다.
 *
 * @param {*} child - 확인할 자식 요소.
 * @returns {boolean} - 자식 요소가 렌더링 가능하면 true, 그렇지 않으면 false를 반환.
 */
const isRenderable = (child) => {
  if (child === null) {
    return false;
  }

  if (typeof child === "string" || typeof child === "number") {
    return true;
  }

  if (typeof child === "object" && "props" in child && "type" in child) {
    return true;
  }

  return false;
};

/**
 * 지정된 타입, 속성 및 자식 요소를 바탕으로 새로운 VDOM 객체를 생성합니다.
 *
 * @param {string|function} type - 요소의 타입으로, HTML 요소의 경우 문자열, 함수형 컴포넌트의 경우 함수가 될 수 있습니다.
 * @param {Object} props - 요소에 할당할 속성들.
 * @param {...any} children - 생성된 요소 내에 중첩될 자식 요소들.
 * @returns {Object} VDOM 객체 또는 함수형 컴포넌트의 리턴값.
 */
export const createElement = (type, props, ...children) => {
  const newProps = { ...props };

  const flattened = flatten(children);
  if (flattened.length > 0) {
    newProps.children = flattened;
  }

  return { type, props: newProps };
};
