import { Sample } from "./sample";

globalThis.createElement = (tag, props, ...children) => {
  console.log("JSX 변환됨:", { tag, props, children });
  return { tag, props, children };
};

globalThis.Fragment = (props, ...children) => children;

Sample();
