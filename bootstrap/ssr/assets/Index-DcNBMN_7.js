import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-DKzRb6H5.js";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Shield, Users, Edit, Trash2 } from "lucide-react";
import "react";
import { S as StatsCard } from "./StatsCard-CnGFB2kC.js";
import { P as PageHeader, C as Card } from "./PageHeader-D62FVbSQ.js";
function RolesIndex({ roles, summary }) {
  const handleDelete = (role) => {
    if (role.users_count > 0) {
      alert("Cannot delete role with assigned users.");
      return;
    }
    if (confirm(`Are you sure you want to delete "${role.display_name}"?`)) {
      router.delete(`/settings/roles/${role.id}`);
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Roles" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Roles",
          subtitle: "Manage user roles and their permissions",
          action: {
            label: "Add Role",
            href: "/settings/roles/create",
            icon: Plus
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Total Roles",
            value: summary.total,
            icon: Shield,
            color: "primary"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Roles with Users",
            value: summary.with_users,
            icon: Users,
            color: "secondary"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: roles.map((role) => /* @__PURE__ */ jsx(Card, { padding: "none", children: /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-10 h-10 rounded-lg flex items-center justify-center",
                style: { backgroundColor: `${role.color}20` },
                children: /* @__PURE__ */ jsx(
                  Shield,
                  {
                    className: "w-5 h-5",
                    style: { color: role.color }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-theme-primary", children: role.display_name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted font-mono", children: role.name })
            ] })
          ] }),
          role.is_default && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-medium rounded", children: "Default" })
        ] }),
        role.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary mb-4 line-clamp-2", children: role.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-theme-muted mb-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }),
            role.users_count,
            " users"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
            role.permissions_count,
            " permissions"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-3 border-t border-theme", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: `/settings/roles/${role.id}/edit`,
              className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors",
              children: [
                /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleDelete(role),
              disabled: role.users_count > 0,
              className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
                "Delete"
              ]
            }
          )
        ] })
      ] }) }, role.id)) }),
      roles.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-theme-secondary mb-4", children: "No roles found" }),
        /* @__PURE__ */ jsxs(Link, { href: "/settings/roles/create", className: "btn btn-primary", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          "Add First Role"
        ] })
      ] }) })
    ] })
  ] });
}
export {
  RolesIndex as default
};
