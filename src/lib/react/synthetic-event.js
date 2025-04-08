class BaseSyntheticEvent {
  constructor(nativeEvent) {
    this.nativeEvent = nativeEvent;
    this.type = nativeEvent.type;
    this.currentTarget = nativeEvent.currentTarget;
    this.target = nativeEvent.target;
  }
}

const createSyntheticEvent = (nativeEvent) => {
  return new BaseSyntheticEvent(nativeEvent);
};

const eventMap = {
  click: "onClick",
  change: "onChange",
};

const findEventHandler = (syntheticEvent, reactRoot) => {
  if (!reactRoot.current) {
    throw new Error("Root must be initalized first");
  }

  const eventType = syntheticEvent.type;
  const eventTarget = syntheticEvent.target;

  const eventProp = eventMap[eventType];

  if (!eventProp) {
    throw new Error("Not registered Event");
  }

  const find = (reactElement) => {
    if (reactElement.domNode === eventTarget) {
      return reactElement.props[eventProp];
    }

    if (reactElement.child) {
      const eventHandler = find(reactElement.child);

      if (eventHandler) {
        return eventHandler;
      }
    }

    if (reactElement.sibling) {
      const eventHandler = find(reactElement.sibling);

      if (eventHandler) {
        return eventHandler;
      }
    }
  };

  return find(reactRoot.current);
};

const handleEvent = (nativeEvent, reactRoot) => {
  const syntheticEvent = createSyntheticEvent(nativeEvent);

  const eventHandler = findEventHandler(syntheticEvent, reactRoot);

  if (eventHandler) {
    eventHandler(syntheticEvent);
  }
};

export const listenToNativeEvents = (rootDomNode, reactRoot) => {
  const eventNames = ["click", "change"];

  for (const eventName of eventNames) {
    rootDomNode.addEventListener(eventName, (nativeEvent) => {
      handleEvent(nativeEvent, reactRoot);
    });
  }
};
