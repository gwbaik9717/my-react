export const EffectTag = {
  Update: Symbol("Update"),
  NoChange: Symbol("NoChange"),
  Deletion: Symbol("Deletion"),
  Placement: Symbol("Placement"),
};

const createReactElement = (element) => {
  // 텍스트 노드일 경우
  if (typeof element === "string" || typeof element === "number") {
    return {
      type: "text",
      text: element.toString(),
      parent: null,
      domNode: null,
      effectTag: EffectTag.NoChange,
      alternate: null,
      child: null,
      sibling: null,
    };
  }

  return {
    // React Component or HTML Tag
    type: element.type,

    // Props
    props: element.props,

    // 실제 DOM 노드
    domNode: null,

    // 변경 되었는지 여부를 기록
    effectTag: EffectTag.NoChange,

    // 저장된 state 값
    memoizedState: null,

    // 다른 트리의 노드 포인터
    alternate: null,

    parent: null,

    child: null,

    sibling: null,
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
const isRenderable = (child) => {
  if (child === null || child === undefined || typeof child === "boolean") {
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
export const render = (virtualNode, alternateReactElement) => {
  if (!isRenderable(virtualNode)) {
    return null;
  }

  const reactElement = createReactElement(virtualNode);
  const reactElementType = reactElement.type;

  // Function Component 일 경우
  if (typeof reactElementType === "function") {
    // 컴포넌트 호출
    const virtualNode = reactElementType(reactElement.props);
    return render(virtualNode, alternateReactElement);
  }

  if (alternateReactElement) {
    reactElement.alternate = alternateReactElement;
  }

  if (reactElementType === "text") {
    return reactElement;
  }

  const virtualNodeChildren = virtualNode.props.children;

  if (!virtualNodeChildren) {
    return reactElement;
  }

  let firstReactElementChild = render(
    virtualNodeChildren[0],
    alternateReactElement?.child
  );

  let i = 1;
  while (!firstReactElementChild && i < virtualNodeChildren.length) {
    firstReactElementChild = render(
      virtualNodeChildren[i],
      alternateReactElement?.child
    );
    i++;
  }

  if (!firstReactElementChild) {
    return reactElement;
  }

  reactElement.child = firstReactElementChild;
  firstReactElementChild.parent = reactElement;

  {
    let currentAlternateReactElement = alternateReactElement?.child?.sibling;
    let prevReactElement = reactElement.child;

    for (let j = i; j < virtualNodeChildren.length; j++) {
      const virtualNodeChild = virtualNodeChildren[i];
      const childReactElement = render(
        virtualNodeChild,
        currentAlternateReactElement
      );

      // 부모 포인터 설정
      childReactElement.parent = reactElement;

      // sibling 포인터 설정
      prevReactElement.sibling = childReactElement;
      prevReactElement = prevReactElement.sibling;

      currentAlternateReactElement = currentAlternateReactElement?.sibling;
    }
  }

  return reactElement;
};
