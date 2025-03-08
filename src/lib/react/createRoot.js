import { React } from "./react";
import { render } from "./render";

export const createRoot = (rootDomNode) => {
  const reactRoot = createRootReact(rootDomNode);

  // Init root
  React.__setRoot(reactRoot);

  const render = (rootVirtualNode) => {
    reactRoot.rootVirtualNode = rootVirtualNode;
    updateRootReactElement(rootVirtualNode, reactRoot);
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

    // virtual Node ex. <App />
    rootVirtualNode: null,
  };
};

const updateRootReactElement = (rootVirtualNode, reactRoot) => {
  const rootReactElement = render(rootVirtualNode);

  // Initial Rendering
  if (!reactRoot.current) {
    reactRoot.current = rootReactElement;
    return;
  }

  // Set new rootReactElement to wip
  reactRoot.wip = rootReactElement;

  // Step 1: Compare current and wip (Reconciliation)
  reconcile(reactRoot.current, reactRoot.wip);

  // Step 2: Apply changes (Commit Phase)
  commitWork(reactRoot.wip);

  // Step 3: Swap wip to current
  reactRoot.current = reactRoot.wip;
  reactRoot.wip = null;
};
