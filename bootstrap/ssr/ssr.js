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
      /* @__PURE__ */ Object.assign({ "./Pages/Auth/Login.tsx": () => import("./assets/Login-DlS3REK4.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-D0FPfwPf.js"), "./Pages/Categories/Form.tsx": () => import("./assets/Form-BCtKbh00.js"), "./Pages/Categories/Index.tsx": () => import("./assets/Index-BBQONVPm.js"), "./Pages/Dashboard.tsx": () => import("./assets/Dashboard-Cjw0yetm.js"), "./Pages/Profile/Index.tsx": () => import("./assets/Index-DruZH6Gk.js"), "./Pages/Projects/Form.tsx": () => import("./assets/Form-DS7aUg2H.js"), "./Pages/Projects/Index.tsx": () => import("./assets/Index-CMlrMYYX.js"), "./Pages/Reports/Budget.tsx": () => import("./assets/Budget-DJWeij5V.js"), "./Pages/Reports/ProjectProgress.tsx": () => import("./assets/ProjectProgress-BzGCqajY.js"), "./Pages/Reports/Spending.tsx": () => import("./assets/Spending-D_oSioen.js"), "./Pages/Reports/TaskProgress.tsx": () => import("./assets/TaskProgress-ChzlHW6X.js"), "./Pages/Settings/Appearance.tsx": () => import("./assets/Appearance-DzVtQb74.js"), "./Pages/Settings/Permissions/Form.tsx": () => import("./assets/Form-BJOqZJI6.js"), "./Pages/Settings/Permissions/Index.tsx": () => import("./assets/Index-BO7jVeCk.js"), "./Pages/Settings/Roles/Form.tsx": () => import("./assets/Form-yLvGDTxJ.js"), "./Pages/Settings/Roles/Index.tsx": () => import("./assets/Index-DcNBMN_7.js"), "./Pages/Settings/Users/Form.tsx": () => import("./assets/Form-B-rlrgnz.js"), "./Pages/Settings/Users/Index.tsx": () => import("./assets/Index-CXP4Yo-E.js"), "./Pages/Tasks/Form.tsx": () => import("./assets/Form-BvbytIDE.js"), "./Pages/Tasks/Index.tsx": () => import("./assets/Index-AfpZ2lbp.js") })
    ),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
