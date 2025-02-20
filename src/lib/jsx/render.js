export const render = (virtualNode, rootNode) => {
  const createDomNode = (node) => {
    const tagName = node.type;
    const attributes = node.props;

    const parentDomNode = document.createElement(tagName);

    for (const [attributeName, attributeValue] of Object.entries(attributes)) {
      if (attributeName === "children") {
        for (const child of attributeValue) {
          let childDomNode = null;

          if (typeof child === "string") {
            childDomNode = document.createTextNode(child);
          } else {
            childDomNode = createDomNode(child);
          }

          parentDomNode.appendChild(childDomNode);
        }

        continue;
      }

      parentDomNode.setAttribute(attributeName, attributeValue);
    }

    return parentDomNode;
  };

  const domNode = createDomNode(virtualNode);
  rootNode.replaceChildren(domNode);
};
