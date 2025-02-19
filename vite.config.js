import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  esbuild: {
    jsxInject: `import { createElement, Fragment } from '@/lib/jsx'`,
    jsxFactory: "createElement",
    jsxFragment: "Fragment",
  },
});
