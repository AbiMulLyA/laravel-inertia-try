import { jsx } from "react/jsx-runtime";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "Dinas Pertanian";
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(
      `./Pages/${name}.tsx`,
      /* @__PURE__ */ Object.assign({ "./Pages/Auth/Login.tsx": () => import("./assets/Login-DlS3REK4.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-D0FPfwPf.js"), "./Pages/Categories/Form.tsx": () => import("./assets/Form-DKl0gyCO.js"), "./Pages/Categories/Index.tsx": () => import("./assets/Index-C4HAGG9N.js"), "./Pages/Dashboard.tsx": () => import("./assets/Dashboard-NhSYBHJ1.js"), "./Pages/Projects/Form.tsx": () => import("./assets/Form-DszMU_aj.js"), "./Pages/Projects/Index.tsx": () => import("./assets/Index-DUwPY2C0.js"), "./Pages/Tasks/Form.tsx": () => import("./assets/Form-CLtr9yWL.js"), "./Pages/Tasks/Index.tsx": () => import("./assets/Index-BvM87J23.js") })
    ),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
