import { App } from "./components/useState/App";
import { createRoot } from "./lib/react/createRoot";

const root = document.getElementById("root");
const reactRoot = createRoot(root);

// Inital Render
reactRoot.render(App);

export const rerender = () => {
  reactRoot.__rerender();
};
