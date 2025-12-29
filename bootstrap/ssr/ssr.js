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
      /* @__PURE__ */ Object.assign({ "./Pages/Auth/Login.tsx": () => import("./assets/Login-DlS3REK4.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-D0FPfwPf.js"), "./Pages/Categories/Form.tsx": () => import("./assets/Form-CAlGihgt.js"), "./Pages/Categories/Index.tsx": () => import("./assets/Index-PMLCh5Vo.js"), "./Pages/Dashboard.tsx": () => import("./assets/Dashboard-C8AuLcAv.js"), "./Pages/Profile/Index.tsx": () => import("./assets/Index-BDWNTto5.js"), "./Pages/Projects/Form.tsx": () => import("./assets/Form-noqCmO6k.js"), "./Pages/Projects/Index.tsx": () => import("./assets/Index-DkC2ySbS.js"), "./Pages/Reports/Budget.tsx": () => import("./assets/Budget-jQQF7Y-9.js"), "./Pages/Reports/ProjectProgress.tsx": () => import("./assets/ProjectProgress-MYd7jNPJ.js"), "./Pages/Reports/Spending.tsx": () => import("./assets/Spending-CviAFx33.js"), "./Pages/Reports/TaskProgress.tsx": () => import("./assets/TaskProgress-BUxDhG2B.js"), "./Pages/Settings/Appearance.tsx": () => import("./assets/Appearance-CSlGsvct.js"), "./Pages/Tasks/Form.tsx": () => import("./assets/Form-C_eoHoUG.js"), "./Pages/Tasks/Index.tsx": () => import("./assets/Index-9Egtzx9b.js") })
    ),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
