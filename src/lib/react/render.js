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

// Convert Virtual Node to React Element
export const render = (virtualNode) => {
  const reactElement = createReactElement(virtualNode);
  const reactElementType = reactElement.type;

  // Function Component 일 경우
  if (typeof reactElementType === "function") {
    // global hooks 초기화
    reactElement.memoizedState = [];
    React.__setGlobalHooks(reactElement.memoizedState);

    // 컴포넌트 호출
    const virtualNode = reactElementType(attributes);
    return render(virtualNode);
  }

  const children = virtualNode.props.children;

  if (!children) {
    return reactElement;
  }

  reactElement.children = [];

  for (const child of children) {
    reactElement.children.push(render(child));
  }

  return reactElement;
};
