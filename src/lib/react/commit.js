import { EffectTag } from "./render";

export const commitRoot = (reactRoot) => {
  // Initial Commit
  if (!reactRoot.wip) {
    commitWork(reactRoot.current, reactRoot.domNode);
    return;
  }

  commitOldWork(reactRoot.current);
  commitWork(reactRoot.wip, reactRoot.domNode);
};

const commitOldWork = (oldReactElement) => {
  if (!oldReactElement) {
    return;
  }

  commitOldWork(oldReactElement.child);
  commitOldWork(oldReactElement.sibling);

  // EffectTag: Deletion
  if (oldReactElement.effectTag === EffectTag.Deletion) {
    oldReactElement.domNode.remove();
  }
};

const commitWork = (reactElement, rootDomNode) => {
  if (!reactElement) {
    return;
  }

  if (typeof reactElement.type === "function") {
    commitWork(reactElement.child, rootDomNode);
    commitWork(reactElement.sibling, rootDomNode);
    return;
  }

  // Initial Commit
  if (!reactElement.domNode) {
    reactElement.domNode = createDomNode(reactElement);

    if (!reactElement.parent) {
      rootDomNode.insertBefore(
        reactElement.domNode,
        reactElement.sibling?.domNode
      );
    } else {
      let parent = reactElement.parent;

      while (typeof parent.type === "function") {
        parent = parent.parent;
      }

      parent.domNode.insertBefore(
        reactElement.domNode,
        reactElement.sibling?.domNode
      );
    }
  }

  // EffectTag: Update
  if (reactElement.effectTag === EffectTag.Update) {
    if (reactElement.type === "text") {
      if (reactElement.text !== reactElement.alternate.text) {
        reactElement.domNode.nodeValue = reactElement.text;
      }

      return;
    }

    // Props 추가 및 업데이트
    for (const [newPropKey, newPropValue] of Object.entries(
      reactElement.props
    )) {
      if (newPropKey === "children") {
        continue;
      }

      const oldProps = reactElement.alternate.props;

      if (!newPropKey in oldProps || newPropValue !== oldProps[newPropKey]) {
        reactElement.domNode.setAttribute(newPropKey, newPropValue);
        continue;
      }
    }

    // Props 제거
    for (const [oldPropKey, oldPropValue] of Object.entries(
      reactElement.alternate.props
    )) {
      if (oldPropKey === "children") {
        continue;
      }

      const newProps = reactElement.alternate.props;

      if (!oldPropKey in newProps) {
        reactElement.domNode.removeAttribute(oldPropKey);
        continue;
      }
    }
  }

  commitWork(reactElement.child, rootDomNode);
  commitWork(reactElement.sibling, rootDomNode);
};

const setAttributes = (domNode, props) => {
  for (const [propKey, propValue] of Object.entries(props)) {
    if (propKey === "children") {
      continue;
    }

    if (propKey === "checked") {
      domNode[propKey] = propValue;
      continue;
    }

    domNode.setAttribute(propKey, propValue);
  }
};

const createDomNode = (reactElement) => {
  // 텍스트 노드일 경우
  if (reactElement.type === "text") {
    const textDomNode = document.createTextNode(reactElement.text);
    return textDomNode;
  }

  // 일반 노드일 경우
  const domNode = document.createElement(reactElement.type);
  setAttributes(domNode, reactElement.props);
  return domNode;
};
