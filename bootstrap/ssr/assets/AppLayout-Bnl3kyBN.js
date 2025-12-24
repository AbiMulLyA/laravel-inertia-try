import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import { X, LayoutDashboard, Building2, FolderKanban, ClipboardList, Users, Menu, User, ChevronDown, LogOut } from "lucide-react";
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Bidang", href: "/bidang", icon: Building2 },
  { name: "Program", href: "/program", icon: FolderKanban },
  { name: "Kegiatan", href: "/kegiatan", icon: ClipboardList },
  { name: "Pelaku Usaha", href: "/pelaku-usaha", icon: Users }
];
function AppLayout({ children }) {
  const { auth, flash } = usePage().props;
  const { url } = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    sidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in",
        onClick: () => setSidebarOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs("aside", { className: `
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `, children: [
      /* @__PURE__ */ jsxs("div", { className: "h-16 flex items-center justify-between px-6 border-b", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/dashboard",
            className: "flex items-center gap-2",
            prefetch: "mount",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-sm", children: "DP" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: "Dinas Pertanian" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "lg:hidden p-1 text-gray-500 hover:text-gray-700",
            onClick: () => setSidebarOpen(false),
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "p-4 space-y-1", children: navigation.map((item) => {
        const isActive = url.startsWith(item.href);
        return /* @__PURE__ */ jsxs(
          Link,
          {
            href: item.href,
            prefetch: "hover",
            className: `
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                    transition-all duration-200
                                    ${isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                                `,
            children: [
              /* @__PURE__ */ jsx(item.icon, { className: `w-5 h-5 ${isActive ? "text-primary-600" : "text-gray-400"}` }),
              item.name
            ]
          },
          item.name
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:pl-64", children: [
      /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-30 h-16 bg-white border-b border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "h-full px-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "lg:hidden p-2 text-gray-500 hover:text-gray-700",
            onClick: () => setSidebarOpen(true),
            children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative ml-auto", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100",
              onClick: () => setUserMenuOpen(!userMenuOpen),
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-green-600" }) }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:block text-sm font-medium text-gray-700", children: auth.user.name }),
                /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-gray-400" })
              ]
            }
          ),
          userMenuOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: "/profile",
                className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                children: [
                  /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
                  "Profil"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: "/logout",
                method: "post",
                as: "button",
                className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
                  "Keluar"
                ]
              }
            )
          ] })
        ] })
      ] }) }),
      flash?.success && /* @__PURE__ */ jsx("div", { className: "mx-4 mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg", children: flash.success }),
      flash?.error && /* @__PURE__ */ jsx("div", { className: "mx-4 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg", children: flash.error }),
      /* @__PURE__ */ jsx("main", { className: "p-4 lg:p-6", children })
    ] })
  ] });
}
export {
  AppLayout as A
};
