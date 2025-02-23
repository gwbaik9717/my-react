export const React = (() => {
  let hooks = [];

  // Use Only For Testing
  const __reset = () => {
    hooks = [];
  };

  let globalHookIndex = 0;

  const __prepareForRender = () => {
    globalHookIndex = 0;
  };

  const useState = (initialValue) => {
    const currentHookIndex = globalHookIndex;

    const setCurrentHook = (value) => {
      hooks[currentHookIndex] = value;
    };

    if (hooks.at(currentHookIndex) === undefined) {
      setCurrentHook(initialValue);
    }

    const setState = (state) => {
      if (typeof state === "function") {
        const newValue = state(hooks.at(currentHookIndex));
        setCurrentHook(newValue);
        return;
      }

      setCurrentHook(state);
    };

    const hook = hooks.at(currentHookIndex);
    globalHookIndex++;

    return [hook, setState];
  };

  return {
    useState,
    __prepareForRender,
    __reset,
  };
})();
