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
const appName = "Base Framework Web di Dishubkominfo";
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(
      `./Pages/${name}.tsx`,
      /* @__PURE__ */ Object.assign({ "./Pages/Auth/Login.tsx": () => import("./assets/Login-jOlAWwG0.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-BtKCtVaz.js"), "./Pages/Categories/Form.tsx": () => import("./assets/Form-BBjNrkDu.js"), "./Pages/Categories/Index.tsx": () => import("./assets/Index-Dk7889Ag.js"), "./Pages/Dashboard.tsx": () => import("./assets/Dashboard-D11YA8CA.js"), "./Pages/Profile/Index.tsx": () => import("./assets/Index-BDaZ9n0H.js"), "./Pages/Projects/Form.tsx": () => import("./assets/Form-KWQ9iQES.js"), "./Pages/Projects/Index.tsx": () => import("./assets/Index-C89PSxKq.js"), "./Pages/Reports/Budget.tsx": () => import("./assets/Budget-_u0VXp_M.js"), "./Pages/Reports/ProjectProgress.tsx": () => import("./assets/ProjectProgress-DMqzUYT4.js"), "./Pages/Reports/Spending.tsx": () => import("./assets/Spending-PQZ_RfWm.js"), "./Pages/Reports/TaskProgress.tsx": () => import("./assets/TaskProgress-i6rMF0p3.js"), "./Pages/Settings/Appearance.tsx": () => import("./assets/Appearance-DZ65K0W9.js"), "./Pages/Settings/Permissions/Form.tsx": () => import("./assets/Form-CiQU3Zyh.js"), "./Pages/Settings/Permissions/Index.tsx": () => import("./assets/Index-CEdFwsP6.js"), "./Pages/Settings/Roles/Form.tsx": () => import("./assets/Form-B3NBxyiN.js"), "./Pages/Settings/Roles/Index.tsx": () => import("./assets/Index-CAocBLQx.js"), "./Pages/Settings/Users/Form.tsx": () => import("./assets/Form-BuAPjS7s.js"), "./Pages/Settings/Users/Index.tsx": () => import("./assets/Index-CvPDiZSm.js"), "./Pages/Tasks/Form.tsx": () => import("./assets/Form-DaTdhfTi.js"), "./Pages/Tasks/Index.tsx": () => import("./assets/Index-rLls9iCY.js") })
    ),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
