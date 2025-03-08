export const EffectTag = {
  Update: Symbol("Update"),
  NoChange: Symbol("NoChange"),
};

const createReactElement = (element) => {
  // 텍스트 노드일 경우
  if (typeof element === "string") {
    return {
      type: "text",
      text: element,
      parent: null,
      domNode: null,
      effectTag: EffectTag.NoChange,
      children: null,
    };
  }

  return {
    // React Component or HTML Tag
    type: element.type,

    // Props
    props: element.props,

    // Parent React Element
    parent: null,

    // 실제 DOM 노드
    domNode: null,

    // 변경 되었는지 여부를 기록
    effectTag: EffectTag.NoChange,

    // 저장된 state 값
    memoizedState: null,

    children: null,
  };
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
export const isRenderable = (child) => {
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

// Convert Virtual Node to React Element
export const render = (virtualNode) => {
  if (!isRenderable(virtualNode)) {
    return virtualNode;
  }

  const reactElement = createReactElement(virtualNode);
  const reactElementType = reactElement.type;

  // Function Component 일 경우
  if (typeof reactElementType === "function") {
    // 컴포넌트 호출
    const virtualNode = reactElementType(reactElement.props);
    return render(virtualNode);
  }

  if (reactElementType === "text") {
    return reactElement;
  }

  const children = reactElement.props.children;

  if (!children) {
    return reactElement;
  }

  reactElement.children = [];

  for (const child of children) {
    const childReactElement = render(child);

    if (childReactElement) {
      // 부모 포인터 설정
      childReactElement.parent = virtualNode;
      reactElement.children.push(childReactElement);
    }
  }

  return reactElement;
};
