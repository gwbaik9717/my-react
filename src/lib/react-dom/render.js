export const render = (virtualNode, rootNode) => {
  const createDomNode = (node) => {
    const tagName = node.type;
    const attributes = node.props;

    const parentDomNode = document.createElement(tagName);

    for (const [attributeName, attributeValue] of Object.entries(attributes)) {
      if (attributeName === "children") {
        for (const child of attributeValue) {
          let childDomNode = null;

          // child 가 텍스트 노드일 경우
          if (typeof child === "string") {
            childDomNode = document.createTextNode(child);
          }
          // child 가 텍스트가 아닌 일반 노드일 경우
          else {
            childDomNode = createDomNode(child);
          }

          parentDomNode.appendChild(childDomNode);
        }

        continue;
      }

      if (attributeName === "onClick") {
        rootNode.addEventListener("click", (event) => {
          if (event.target === parentDomNode) {
            attributeValue();
          }
        });
      }

      parentDomNode.setAttribute(attributeName, attributeValue);
    }

    return parentDomNode;
  };

  const domNode = createDomNode(virtualNode);
  rootNode.replaceChildren(domNode);
};
