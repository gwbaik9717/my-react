import { React } from "../react";

export const createRoot = (rootDomNode) => {
  const reactRoot = createRootReact(rootDomNode);

  const render = (virtualNode) => {
    createRootReactElement(virtualNode, reactRoot);
  };

  return {
    render,
  };
};

const createRootReact = (container) => {
  return {
    // 실제 DOM 노드
    domNode: container,

    // 화면에 보여지고 있는 ReactTree
    current: null,

    //
    wip: null,
  };
};

const EffectTag = {
  NoChange: "NoChange",
  Update: "Update",
  Placement: "Placement",
};

const createReactElement = (element) => {
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

    children: null,
  };
};

// Convert virtualNode to React Element
const createRootReactElement = (virtualNode, reactRoot) => {
  const render = (virtualNode) => {
    const reactElement = createReactElement(virtualNode);

    const elementType = reactElement.type;

    // Function Component 일 경우
    if (typeof elementType === "function") {
      // global hooks 초기화
      reactElement.memoizedState = [];
      React.__setGlobalHooks(reactElement.memoizedState);

      // 컴포넌트 호출
      const virtualNode = elementType(attributes);
      return render(virtualNode);
    }

    const children = virtualNode.props.children;

    if (!children) {
      return createReactElement(virtualNode);
    }

    reactElement.children = [];

    for (const child of children) {
      reactElement.children.push(render(child));
    }

    return reactElement;
  };

  const rootReactElement = render(virtualNode);

  // Initial Rendering
  if (!reactRoot.current) {
    reactRoot.current = rootReactElement;
  }
};
