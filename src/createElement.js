const flatten = (child) => {
  const result = [];

  if (Array.isArray(child)) {
    for (const item of child) {
      const flattened = flatten(item);
      result.push(...flattened);
    }

    return result;
  }

  if (isRenderable(child)) {
    result.push(child);
  }

  return result;
};

const isRenderable = (child) => {
  if (child === true || child === false) {
    return false;
  }

  if (child === undefined || child === null) {
    return false;
  }

  return true;
};

export const createElement = (type, props, ...children) => {
  const newProps = { ...props };

  // Function Component
  if (typeof type === "function") {
    const element = type(props);

    return element;
  }

  const flattened = flatten(children);
  if (flattened.length > 0) {
    newProps.children = flattened;
  }

  return { type, props: newProps };
};
