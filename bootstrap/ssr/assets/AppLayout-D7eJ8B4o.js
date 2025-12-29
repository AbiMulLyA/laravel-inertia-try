import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, ChevronLeft, X, LayoutDashboard, Database, FileText, Palette, Settings, User, LogOut, ChevronUp, Menu } from "lucide-react";
function NavItem({ item, depth = 0, collapsed = false }) {
  const { url } = usePage();
  const hasChildren = item.children && item.children.length > 0;
  const storageKey = `nav-expand-${item.name.toLowerCase().replace(/\s/g, "-")}`;
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      return stored === "true";
    }
    return false;
  });
  const isActive = item.href ? url.startsWith(item.href) : false;
  const hasActiveChild = item.children?.some(
    (child) => child.href ? url.startsWith(child.href) : false
  ) || false;
  useEffect(() => {
    if (hasActiveChild && !isExpanded) {
      setIsExpanded(true);
    }
  }, [hasActiveChild]);
  const toggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, String(newState));
    }
  };
  const paddingLeft = collapsed ? 12 : 12 + depth * 16;
  const activeClasses = "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300";
  const inactiveClasses = "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100";
  const iconActiveClasses = "text-primary-600 dark:text-primary-400";
  const iconInactiveClasses = "text-gray-400 dark:text-gray-500";
  if (collapsed && depth === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
      item.href ? /* @__PURE__ */ jsx(
        Link,
        {
          href: item.href,
          className: `
                            flex items-center justify-center w-10 h-10 mx-auto rounded-lg
                            transition-all duration-200
                            ${isActive ? activeClasses : inactiveClasses}
                        `,
          children: item.icon && /* @__PURE__ */ jsx(item.icon, { className: `w-5 h-5 ${isActive ? iconActiveClasses : iconInactiveClasses}` })
        }
      ) : /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleExpand,
          className: `
                            flex items-center justify-center w-10 h-10 mx-auto rounded-lg
                            transition-all duration-200
                            ${hasActiveChild ? activeClasses : inactiveClasses}
                        `,
          children: item.icon && /* @__PURE__ */ jsx(item.icon, { className: `w-5 h-5 ${hasActiveChild ? iconActiveClasses : iconInactiveClasses}` })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute left-full top-0 ml-2 hidden group-hover:block z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg", children: [
        item.name,
        item.badge && /* @__PURE__ */ jsx("span", { className: "ml-2 px-1.5 py-0.5 bg-primary-500 rounded text-xs", children: item.badge })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    hasChildren ? (
      // Group item (expandable)
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: toggleExpand,
          className: `
                        w-full flex items-center gap-3 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${hasActiveChild ? activeClasses : inactiveClasses}
                    `,
          style: { paddingLeft: `${paddingLeft}px`, paddingRight: "12px" },
          children: [
            depth === 0 && item.icon && /* @__PURE__ */ jsx(item.icon, { className: `w-5 h-5 flex-shrink-0 ${hasActiveChild ? iconActiveClasses : iconInactiveClasses}` }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left sidebar-text truncate", children: item.name }),
            item.badge && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium sidebar-text", children: item.badge }),
            isExpanded ? /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" })
          ]
        }
      )
    ) : (
      // Leaf item (link)
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: item.href || "#",
          prefetch: "hover",
          className: `
                        flex items-center gap-3 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${isActive ? activeClasses : inactiveClasses}
                    `,
          style: { paddingLeft: `${paddingLeft}px`, paddingRight: "12px" },
          children: [
            depth === 0 && item.icon && /* @__PURE__ */ jsx(item.icon, { className: `w-5 h-5 flex-shrink-0 ${isActive ? iconActiveClasses : iconInactiveClasses}` }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 sidebar-text truncate", children: item.name }),
            item.badge && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium sidebar-text", children: item.badge })
          ]
        }
      )
    ),
    hasChildren && isExpanded && /* @__PURE__ */ jsx("div", { className: "mt-1 space-y-1", children: item.children.map((child, index) => /* @__PURE__ */ jsx(
      NavItem,
      {
        item: child,
        depth: depth + 1,
        collapsed
      },
      `${child.name}-${index}`
    )) })
  ] });
}
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Master Data",
    icon: Database,
    children: [
      { name: "Categories", href: "/categories" },
      { name: "Projects", href: "/projects" },
      { name: "Tasks", href: "/tasks" }
    ]
  },
  {
    name: "Reports",
    icon: FileText,
    children: [
      {
        name: "Financial",
        children: [
          { name: "Budget Report", href: "/reports/budget" },
          { name: "Spending Report", href: "/reports/spending" }
        ]
      },
      {
        name: "Progress",
        children: [
          { name: "Project Progress", href: "/reports/project-progress" },
          { name: "Task Progress", href: "/reports/task-progress" }
        ]
      }
    ]
  },
  {
    name: "Settings",
    icon: Settings,
    children: [
      { name: "Appearance", href: "/settings/appearance", icon: Palette }
    ]
  }
];
function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose
}) {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    mobileOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in",
        onClick: onMobileClose
      }
    ),
    /* @__PURE__ */ jsxs("aside", { className: `
                fixed inset-y-0 left-0 z-50 bg-theme-primary
                transform transition-all duration-300 ease-in-out flex flex-col
                lg:translate-x-0
                ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                ${collapsed ? "w-[72px]" : "w-64"}
            `, children: [
      /* @__PURE__ */ jsx("div", { className: "hidden lg:flex items-center justify-end px-3 py-2", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onToggle,
          className: "p-2 text-theme-muted hover:text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors",
          children: collapsed ? /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 pb-4", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/dashboard",
            className: "flex items-center gap-3",
            prefetch: "mount",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-sm", children: "KM" }) }),
              !collapsed && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-theme-primary", children: "Kominfo" }),
                /* @__PURE__ */ jsx("span", { className: "block text-xs text-theme-muted", children: "Admin Panel" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "lg:hidden p-2 text-theme-muted hover:text-theme-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
            onClick: onMobileClose,
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 px-3 space-y-1 overflow-y-auto hide-scrollbar", children: navigation.map((item, index) => /* @__PURE__ */ jsx(
        NavItem,
        {
          item,
          collapsed
        },
        `${item.name}-${index}`
      )) }),
      /* @__PURE__ */ jsx("div", { className: "p-3", ref: profileRef, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        profileOpen && !collapsed && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-full left-0 right-0 mb-2 bg-theme-primary rounded-xl shadow-lg border border-theme overflow-hidden animate-slide-up", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/profile",
              className: "flex items-center gap-3 px-4 py-3 text-sm text-theme-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              onClick: () => setProfileOpen(false),
              children: [
                /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Profile" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/logout",
              method: "post",
              as: "button",
              className: "w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
              onClick: () => setProfileOpen(false),
              children: [
                /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Logout" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => !collapsed && setProfileOpen(!profileOpen),
            className: `
                                w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50
                                hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                                ${collapsed ? "justify-center" : ""}
                            `,
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white font-semibold text-sm", children: initials }) }),
              !collapsed && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 text-left", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-theme-primary truncate", children: user?.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted truncate", children: user?.email })
                ] }),
                /* @__PURE__ */ jsx(ChevronUp, { className: `w-4 h-4 text-theme-muted transition-transform ${profileOpen ? "" : "rotate-180"}` })
              ] })
            ]
          }
        )
      ] }) })
    ] })
  ] });
}
function AppLayout({ children }) {
  const { flash } = usePage().props;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true";
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-theme-secondary transition-colors duration-300", children: [
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        collapsed: sidebarCollapsed,
        onToggle: () => setSidebarCollapsed(!sidebarCollapsed),
        mobileOpen,
        onMobileClose: () => setMobileOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"}`, children: [
      /* @__PURE__ */ jsx("div", { className: "lg:hidden sticky top-0 z-30 p-4", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "p-2 text-theme-muted hover:text-theme-primary rounded-lg bg-theme-primary shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
          onClick: () => setMobileOpen(true),
          children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "px-4 lg:px-6", children: [
        flash?.success && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-4 bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800 text-secondary-700 dark:text-secondary-300 rounded-xl flex items-start gap-3 animate-slide-down", children: [
          /* @__PURE__ */ jsx("div", { className: "w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }),
          /* @__PURE__ */ jsx("p", { children: flash.success })
        ] }),
        flash?.error && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-start gap-3 animate-slide-down", children: [
          /* @__PURE__ */ jsx("div", { className: "w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M6 18L18 6M6 6l12 12" }) }) }),
          /* @__PURE__ */ jsx("p", { children: flash.error })
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "p-4 lg:p-6 lg:pt-4", children })
    ] })
  ] });
}
export {
  AppLayout as A
};
