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
      /* @__PURE__ */ Object.assign({ "./Pages/Auth/Login.tsx": () => import("./assets/Login-DlS3REK4.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-D0FPfwPf.js"), "./Pages/Categories/Form.tsx": () => import("./assets/Form-BCtKbh00.js"), "./Pages/Categories/Index.tsx": () => import("./assets/Index-Ds_OvTw6.js"), "./Pages/Dashboard.tsx": () => import("./assets/Dashboard-DnL10aW2.js"), "./Pages/Profile/Index.tsx": () => import("./assets/Index-CUhgjMT1.js"), "./Pages/Projects/Form.tsx": () => import("./assets/Form-DS7aUg2H.js"), "./Pages/Projects/Index.tsx": () => import("./assets/Index-BLR7T4CT.js"), "./Pages/Reports/Budget.tsx": () => import("./assets/Budget-C1LQlDsw.js"), "./Pages/Reports/ProjectProgress.tsx": () => import("./assets/ProjectProgress-Dk3GAvjy.js"), "./Pages/Reports/Spending.tsx": () => import("./assets/Spending-CpZumXdA.js"), "./Pages/Reports/TaskProgress.tsx": () => import("./assets/TaskProgress-B8BZLZa5.js"), "./Pages/Settings/Appearance.tsx": () => import("./assets/Appearance-B7FWhsg-.js"), "./Pages/Settings/Permissions/Form.tsx": () => import("./assets/Form-Dg7vkM79.js"), "./Pages/Settings/Permissions/Index.tsx": () => import("./assets/Index-DojhHmOx.js"), "./Pages/Settings/Roles/Form.tsx": () => import("./assets/Form-Burs7NOd.js"), "./Pages/Settings/Roles/Index.tsx": () => import("./assets/Index-BViZ4F6N.js"), "./Pages/Settings/Users/Form.tsx": () => import("./assets/Form-iXoMg6Aj.js"), "./Pages/Settings/Users/Index.tsx": () => import("./assets/Index-DReQUPpG.js"), "./Pages/Tasks/Form.tsx": () => import("./assets/Form-BvbytIDE.js"), "./Pages/Tasks/Index.tsx": () => import("./assets/Index-CLOFmxlt.js") })
    ),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
