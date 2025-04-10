export const React = (() => {
  let globalHooks = null;
  let globalHookIndex = 0;

  // Function Component 호출 전 불려야 함.
  const __prepare = (hooks) => {
    globalHooks = hooks;

    globalHookIndex = 0;
  };

  // Reset React
  const __reset = () => {
    globalHooks = null;
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

  return {
    useState,
    __prepare,
    __reset,
  };
})();
