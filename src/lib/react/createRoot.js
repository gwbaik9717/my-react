import { commitRoot } from "./commit";
import { React } from "./react";
import { reconcile } from "./reconcile";
import { render } from "./render";
import { listenToNativeEvents } from "./synthetic-event";

export const createRoot = (rootDomNode) => {
  const reactRoot = createRootReact(rootDomNode);

  listenToNativeEvents(rootDomNode, reactRoot);

  const render = (component) => {
    if (!reactRoot.component) {
      reactRoot.component = component;
    }

    __rerender();
  };

  const __rerender = () => {
    const virtualNode = reactRoot.component();
    updateRootReactElement(virtualNode, rootDomNode, reactRoot);
  };

  return {
    render,
    __rerender,
  };
};

const createRootReact = (rootDomNode) => {
  return {
    // 실제 DOM 노드
    domNode: rootDomNode,

    // 화면에 보여지고 있는 React Element Tree
    current: null,

    // 수정 중인 React Element Tree
    wip: null,

    // 루트 컴포넌트
    component: null,
  };
};

const updateRootReactElement = (virtualNode, rootDomNode, reactRoot) => {
  // Initial Rerendering
  if (!reactRoot.current) {
    // Step 1. Convert Virtual Node to React Element
    reactRoot.current = render(virtualNode);

    // Step 2: Create DOM
    commitRoot(reactRoot);
    return;
  }

  // Rerendering
  // Step 1. Convert Virtual Node to React Element
  reactRoot.wip = render(virtualNode, reactRoot.current);

  // Step 2: Compare current and wip
  reconcile(reactRoot.wip, reactRoot.current);

  // Step 3: Apply changes to DOM
  commitRoot(reactRoot);

  // Step 4: Swap wip to current
  reactRoot.current = reactRoot.wip;
  reactRoot.wip = null;
};
