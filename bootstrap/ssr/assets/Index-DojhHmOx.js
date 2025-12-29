import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-DKzRb6H5.js";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Key, Layers, Edit, Trash2 } from "lucide-react";
import "react";
import { S as StatsCard } from "./StatsCard-DQVB_KgP.js";
import { P as PageHeader, C as Card } from "./PageHeader-DAtmv7HV.js";
function PermissionsIndex({ grouped, summary }) {
  const handleDelete = (permission) => {
    if (confirm(`Are you sure you want to delete "${permission.display_name}"?`)) {
      router.delete(`/settings/permissions/${permission.id}`);
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Permissions" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Permissions",
          subtitle: "Manage system permissions",
          action: {
            label: "Add Permission",
            href: "/settings/permissions/create",
            icon: Plus
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Total Permissions",
            value: summary.total,
            icon: Key,
            color: "primary"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Permission Groups",
            value: summary.groups,
            icon: Layers,
            color: "secondary"
          }
        )
      ] }),
      Object.keys(grouped).length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsx(Key, { className: "w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-theme-secondary mb-4", children: "No permissions found" }),
        /* @__PURE__ */ jsxs(Link, { href: "/settings/permissions/create", className: "btn btn-primary", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          "Add First Permission"
        ] })
      ] }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-6", children: Object.entries(grouped).map(([group, groupPermissions]) => /* @__PURE__ */ jsxs(Card, { padding: "none", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-theme", children: /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-theme-primary capitalize flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4 text-primary-500" }),
          group,
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-normal text-theme-muted", children: [
            "(",
            groupPermissions.length,
            " permissions)"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-100 dark:divide-gray-800", children: groupPermissions.map((permission) => /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-theme-primary", children: permission.display_name }),
              /* @__PURE__ */ jsx("code", { className: "text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-theme-muted", children: permission.name })
            ] }),
            permission.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary mt-0.5", children: permission.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-theme-muted", children: [
              permission.roles_count,
              " roles"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/settings/permissions/${permission.id}/edit`,
                  className: "p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors",
                  children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(permission),
                  className: "p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] })
          ] })
        ] }, permission.id)) })
      ] }, group)) })
    ] })
  ] });
}
export {
  PermissionsIndex as default
};
