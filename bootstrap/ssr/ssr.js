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
      /* @__PURE__ */ Object.assign({ "./Pages/Auth/Login.tsx": () => import("./assets/Login-DlS3REK4.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-D0FPfwPf.js"), "./Pages/Categories/Form.tsx": () => import("./assets/Form-BZTIKEKx.js"), "./Pages/Categories/Index.tsx": () => import("./assets/Index-DcoZQIGj.js"), "./Pages/Dashboard.tsx": () => import("./assets/Dashboard-CMdffUXt.js"), "./Pages/Profile/Index.tsx": () => import("./assets/Index-Bi-MlfIS.js"), "./Pages/Projects/Form.tsx": () => import("./assets/Form-DM8aV2M8.js"), "./Pages/Projects/Index.tsx": () => import("./assets/Index-DsG3YWCN.js"), "./Pages/Reports/Budget.tsx": () => import("./assets/Budget-CvXOY8IS.js"), "./Pages/Reports/ProjectProgress.tsx": () => import("./assets/ProjectProgress-B8m4zhOs.js"), "./Pages/Reports/Spending.tsx": () => import("./assets/Spending-CX06hXJ5.js"), "./Pages/Reports/TaskProgress.tsx": () => import("./assets/TaskProgress-DGXtcr9P.js"), "./Pages/Settings/Appearance.tsx": () => import("./assets/Appearance-DaoQPpYG.js"), "./Pages/Settings/Users/Form.tsx": () => import("./assets/Form-CMjIih9m.js"), "./Pages/Settings/Users/Index.tsx": () => import("./assets/Index-BnRkbcN_.js"), "./Pages/Tasks/Form.tsx": () => import("./assets/Form-BM_MI5sA.js"), "./Pages/Tasks/Index.tsx": () => import("./assets/Index-JidSSTdj.js") })
    ),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
