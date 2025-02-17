import { App } from "./components/App";
import { createElement } from "./lib/createElement";
import { Fragment } from "./lib/fragment";

globalThis.createElement = createElement;
globalThis.Fragment = Fragment;

const app = App();
console.log(app);
