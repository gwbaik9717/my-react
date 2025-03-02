const eventAttributes = ["onClick"];

/**
 * 루트 노드에 이벤트 리스너를 추가하는 함수
 *
 * @param {HTMLElement} rootNode - 이벤트 리스너를 추가할 루트 노드
 * @param {HTMLElement} eventNode - 이벤트가 발생할 노드
 * @param {string} attribute - 이벤트 속성명 (ex. onClick)
 * @param {Function} callback - 이벤트 발생 시 호출될 콜백 함수
 */
const addEventListenerToRootNode = (
  rootNode,
  eventNode,
  attribute,
  callback
) => {
  if (!eventAttributes.includes(attribute)) {
    return;
  }

  // addEventListener의 type parameter 로 전달할 수 있는 이름으로 변환 (ex. onClick -> click)
  const eventType = attribute.slice(2).toLowerCase();

  const eventHandler = (event) => {
    if (event.target === eventNode) {
      callback();
    }
  };

  rootNode.addEventListener(eventType, eventHandler);
};

/**
 * 가상 DOM 노드를 실제 DOM 노드로 변환하여 루트 노드에 렌더링하는 함수
 *
 * @param {Object} virtualNode - 렌더링할 가상 DOM 노드
 * @param {HTMLElement} rootNode - 렌더링할 루트 노드
 */
export const render = (virtualNode, rootNode) => {
  const createDomNode = (node) => {
    const tagType = node.type;
    const attributes = node.props;

    // Function Component 일 경우
    if (typeof tagType === "function") {
      const virtualNode = tagType(attributes);
      return createDomNode(virtualNode);
    }

    const parentDomNode = document.createElement(tagType);

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

      // 루트 노드에 이벤트 리스너 등록
      if (eventAttributes.includes(attributeName)) {
        addEventListenerToRootNode(
          rootNode,
          parentDomNode,
          attributeName,
          attributeValue
        );
      }

      parentDomNode.setAttribute(attributeName, attributeValue);
    }

    return parentDomNode;
  };

  const domNode = createDomNode(virtualNode);
  rootNode.replaceChildren(domNode);
};
