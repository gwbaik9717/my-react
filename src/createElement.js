export const createElement = (type, props, ...children) => {
  const newProps = { ...props };

  const newChildren = [];

  const flatten = (target) => {
    const result = [];

    if (Array.isArray(target)) {
      for (const item of target) {
        const flattened = flatten(item);
        result.push(...flattened);
      }

      return result;
    }

    if (target === true || target === false) {
      return result;
    }

    result.push(target);

    return result;
  };

  const flattened = flatten(children);
  newChildren.push(...flattened);

  if (newChildren.length > 0) {
    newProps.children = newChildren;
  }

  return { type, props: newProps };
};
