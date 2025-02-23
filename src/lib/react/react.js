export const React = (() => {
  let globalHooksMap = new Map();
  let globalHooks = null;
  let globalHookIndex = 0;

  // Reset React
  const __reset = () => {
    globalHooksMap = new Map();
    globalHooks = null;
    globalHookIndex = 0;
  };

  // Reset hooks before rendering
  const __prepareForRender = (Component) => {
    if (!globalHooksMap.has(Component)) {
      globalHooksMap.set(Component, []);
    }

    globalHooks = globalHooksMap.get(Component);
    globalHookIndex = 0;
  };

  const useState = (initialValue) => {
    if (globalHooks === null) {
      throw new Error("NOT_READY");
    }

    const currentHooks = globalHooks;
    const currentHookIndex = globalHookIndex;

    const setCurrentHook = (value) => {
      currentHooks[currentHookIndex] = value;
    };

    if (currentHooks.at(currentHookIndex) === undefined) {
      setCurrentHook(initialValue);
    }

    const setState = (state) => {
      if (typeof state === "function") {
        const newValue = state(currentHooks.at(currentHookIndex));
        setCurrentHook(newValue);
        return;
      }

      setCurrentHook(state);
    };

    const hook = currentHooks.at(currentHookIndex);
    globalHookIndex++;

    return [hook, setState];
  };

  console.log(globalHooksMap);

  return {
    useState,
    __prepareForRender,
    __reset,
  };
})();
