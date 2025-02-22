export const React = (() => {
  let hook = null;

  const useState = (initialValue) => {
    hook = initialValue;

    const setState = (newValue) => {
      hook = newValue;
    };

    return [hook, setState];
  };

  return {
    useState,
  };
})();
