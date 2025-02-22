export const React = (() => {
  let hook;

  // Use Only For Testing
  const __reset = () => {
    hook = undefined;
  };

  const useState = (initialValue) => {
    if (hook === undefined) {
      hook = initialValue;
    }

    const setState = (state) => {
      if (typeof state === "function") {
        hook = state(hook);
        return;
      }

      hook = state;
    };

    return [hook, setState];
  };

  return {
    useState,
    __reset,
  };
})();
