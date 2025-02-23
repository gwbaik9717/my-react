import { App } from "./components/useState/App";
import { render } from "./lib/jsx";
import { React } from "./lib/react";

const sample = (Component, rootNode) => () => {
  React.__prepareForRender();
  render(Component(), rootNode);
};

const root = document.getElementById("root");

export const renderApp = sample(App, root);

renderApp();
