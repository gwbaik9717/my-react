import { App } from "./components/App";
import { createElement } from "./createElement";

globalThis.createElement = createElement;
globalThis.Fragment = (props, ...children) => children;

const app = App();
console.log(app);
