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
      /* @__PURE__ */ Object.assign({ "./Pages/Auth/Login.tsx": () => import("./assets/Login-DlS3REK4.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-D0FPfwPf.js"), "./Pages/Bidang/Form.tsx": () => import("./assets/Form-m4nqzXTC.js"), "./Pages/Bidang/Index.tsx": () => import("./assets/Index-CCTiN59y.js"), "./Pages/Dashboard.tsx": () => import("./assets/Dashboard-VDwWAVB-.js"), "./Pages/Kegiatan/Form.tsx": () => import("./assets/Form-oU8UltpI.js"), "./Pages/Kegiatan/Index.tsx": () => import("./assets/Index-CNQ3b83H.js"), "./Pages/PelakuUsaha/Form.tsx": () => import("./assets/Form-DGUKx2Oc.js"), "./Pages/PelakuUsaha/Import.tsx": () => import("./assets/Import-CcsAx3A3.js"), "./Pages/PelakuUsaha/Index.tsx": () => import("./assets/Index-BgNRaiw0.js"), "./Pages/Program/Form.tsx": () => import("./assets/Form-CI3Y69cQ.js"), "./Pages/Program/Index.tsx": () => import("./assets/Index-CjnNslz2.js") })
    ),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
