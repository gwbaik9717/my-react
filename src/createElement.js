export const createElement = (type, props, ...children) => {
  const newProps = {};

  if (props !== null) {
    for (const [key, value] of Object.entries(props)) {
      newProps[key] = value;
    }
  }

  if (children.length !== 0) {
    newProps.children = children;
  }

  return { type, props: newProps };
};
