import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
//#region resources/js/ssr.tsx
var appName = "Base Framework Web di Dishubkominfo";
var pages = /* #__PURE__ */ Object.assign({
	"./Pages/Auth/Login.tsx": () => import("./assets/Login-DOv4r2dr.js"),
	"./Pages/Auth/Register.tsx": () => import("./assets/Register-DKbqR7Ch.js"),
	"./Pages/Categories/Form.tsx": () => import("./assets/Form-BoBNHgcE.js"),
	"./Pages/Categories/Index.tsx": () => import("./assets/Index-DdD33rKB.js"),
	"./Pages/Dashboard.tsx": () => import("./assets/Dashboard-BtEmwvq0.js"),
	"./Pages/Profile/Index.tsx": () => import("./assets/Index-CAUgB-q-.js"),
	"./Pages/Projects/Form.tsx": () => import("./assets/Form-DOAW9Z-g.js"),
	"./Pages/Projects/Index.tsx": () => import("./assets/Index-BCkUc14-.js"),
	"./Pages/Reports/Budget.tsx": () => import("./assets/Budget-CIHHLKRH.js"),
	"./Pages/Reports/ProjectProgress.tsx": () => import("./assets/ProjectProgress-CS81_6Np.js"),
	"./Pages/Reports/Spending.tsx": () => import("./assets/Spending-Dvu2EbHv.js"),
	"./Pages/Reports/TaskProgress.tsx": () => import("./assets/TaskProgress-C95DIG27.js"),
	"./Pages/Settings/Appearance.tsx": () => import("./assets/Appearance-Cbj69Tk7.js"),
	"./Pages/Settings/Permissions/Form.tsx": () => import("./assets/Form-DsKAZ6Fq.js"),
	"./Pages/Settings/Permissions/Index.tsx": () => import("./assets/Index-zYvYw-RP.js"),
	"./Pages/Settings/Roles/Form.tsx": () => import("./assets/Form-DnmEa54z.js"),
	"./Pages/Settings/Roles/Index.tsx": () => import("./assets/Index-CqlTaLuU.js"),
	"./Pages/Settings/Users/Form.tsx": () => import("./assets/Form-BviaSV6a.js"),
	"./Pages/Settings/Users/Index.tsx": () => import("./assets/Index-C_G58sh3.js"),
	"./Pages/Tasks/Form.tsx": () => import("./assets/Form-zwwdt-Md.js"),
	"./Pages/Tasks/Index.tsx": () => import("./assets/Index-ZZo5kw5y.js")
});
async function resolvePageComponent(name) {
	const page = pages[`./Pages/${name}.tsx`];
	if (!page) throw new Error(`Page not found: ${name}`);
	return (await page()).default;
}
createServer((page) => createInertiaApp({
	page,
	render: renderToString,
	title: (title) => `${title} - ${appName}`,
	resolve: resolvePageComponent,
	setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
}));
//#endregion
export {};
