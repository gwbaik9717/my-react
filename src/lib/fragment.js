export const Fragment = (props) => {
  if (props.children) {
    return [...props.children];
  }

  return [];
};
