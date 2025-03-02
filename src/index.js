import { App } from "./components/useState/App";
import { ReactDOM } from "./lib/react-dom";
import { React } from "./lib/react";

const render = (Component, rootNode) => {
  React.__prepareForRender(Component);
  ReactDOM.render(Component(), rootNode);
};

const root = document.getElementById("root");

export const renderApp = () => render(App, root);

// 초기 렌더링
renderApp();
