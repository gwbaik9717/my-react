import { React } from "./react";
import { render } from "./render";

export const createRoot = (rootDomNode) => {
  const reactRoot = createRootReact(rootDomNode);

  // Init root
  React.__setRoot(reactRoot);

  const render = (virtualNode) => {
    updateRootReactElement(virtualNode, rootDomNode, reactRoot);
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

    // 수정 중인 React Tree
    wip: null,
  };
};

const updateRootReactElement = (virtualNode, rootDomNode, reactRoot) => {
  // Initial Rerendering
  if (!reactRoot.current) {
    reactRoot.current = render(virtualNode);
    commitWork(reactRoot);
    return;
  }

  // Rerendering
  reactRoot.wip = render(virtualNode, reactRoot.current);

  // Step 1: Compare current and wip
  reconcile(reactRoot.wip, reactRoot.current);

  // Step 2: Apply changes (Commit Phase)
  commitWork(reactRoot);

  // Step 3: Swap wip to current
  reactRoot.current = reactRoot.wip;
  reactRoot.wip = null;
};
