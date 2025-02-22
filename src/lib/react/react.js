export const React = (() => {
  let hook;

  const useState = (initialValue) => {
    if (hook === undefined) {
      hook = initialValue;
    }

    const setState = (newValue) => {
      hook = newValue;
    };

    return [hook, setState];
  };

  return {
    useState,
  };
})();
