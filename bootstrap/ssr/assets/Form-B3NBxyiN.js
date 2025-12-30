import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-ClUKwJTp.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Shield, Check } from "lucide-react";
import "react";
import { P as PageHeader, C as Card } from "./PageHeader-DAtmv7HV.js";
const colorOptions = [
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#16A34A" },
  { name: "Gold", value: "#F59E0B" },
  { name: "Red", value: "#DC2626" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Cyan", value: "#0891B2" },
  { name: "Pink", value: "#DB2777" },
  { name: "Gray", value: "#6B7280" }
];
function RoleForm({ role, permissions, isEdit }) {
  const form = useForm({
    name: role?.name || "",
    display_name: role?.display_name || "",
    description: role?.description || "",
    color: role?.color || "#2563EB",
    is_default: role?.is_default || false,
    permissions: role?.permissions || []
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit && role?.id) {
      form.put(`/settings/roles/${role.id}`);
    } else {
      form.post("/settings/roles");
    }
  };
  const togglePermission = (permissionId) => {
    const current = form.data.permissions;
    if (current.includes(permissionId)) {
      form.setData("permissions", current.filter((id) => id !== permissionId));
    } else {
      form.setData("permissions", [...current, permissionId]);
    }
  };
  const toggleGroup = (group) => {
    const groupPermissionIds = permissions[group]?.map((p) => p.id) || [];
    const allSelected = groupPermissionIds.every((id) => form.data.permissions.includes(id));
    if (allSelected) {
      form.setData("permissions", form.data.permissions.filter((id) => !groupPermissionIds.includes(id)));
    } else {
      const newPermissions = [.../* @__PURE__ */ new Set([...form.data.permissions, ...groupPermissionIds])];
      form.setData("permissions", newPermissions);
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Role" : "Add Role" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-4xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/settings/roles",
            className: "p-2 text-theme-muted hover:text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors",
            children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          PageHeader,
          {
            title: isEdit ? "Edit Role" : "Add Role",
            subtitle: isEdit ? `Editing ${role?.display_name}` : "Create a new role with permissions"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-10 h-10 rounded-lg flex items-center justify-center",
                style: { backgroundColor: `${form.data.color}20` },
                children: /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5", style: { color: form.data.color } })
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-theme-primary", children: "Role Information" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary", children: "Basic role details" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "form-label", children: "Name (slug)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: form.data.name,
                  onChange: (e) => form.setData("name", e.target.value.toLowerCase().replace(/\s/g, "_")),
                  className: "form-input font-mono",
                  placeholder: "admin"
                }
              ),
              form.errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: form.errors.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "form-label", children: "Display Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: form.data.display_name,
                  onChange: (e) => form.setData("display_name", e.target.value),
                  className: "form-input",
                  placeholder: "Administrator"
                }
              ),
              form.errors.display_name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: form.errors.display_name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label", children: "Description" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: form.data.description,
                  onChange: (e) => form.setData("description", e.target.value),
                  className: "form-input",
                  rows: 2,
                  placeholder: "Brief description of this role..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "form-label", children: "Color" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: colorOptions.map((color) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => form.setData("color", color.value),
                  className: `w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${form.data.color === color.value ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`,
                  style: { backgroundColor: color.value },
                  title: color.name,
                  children: form.data.color === color.value && /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-white" })
                },
                color.value
              )) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: form.data.is_default,
                  onChange: (e) => form.setData("is_default", e.target.checked),
                  className: "w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-theme-primary", children: "Set as default role for new users" })
            ] }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-theme-primary mb-2", children: "Permissions" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary mb-6", children: "Select which permissions this role should have" }),
          Object.keys(permissions).length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-theme-muted", children: [
            /* @__PURE__ */ jsx("p", { children: "No permissions available. Create some permissions first." }),
            /* @__PURE__ */ jsx(Link, { href: "/settings/permissions/create", className: "btn btn-outline mt-4", children: "Add Permission" })
          ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-6", children: Object.entries(permissions).map(([group, groupPermissions]) => {
            const groupIds = groupPermissions.map((p) => p.id);
            const allSelected = groupIds.every((id) => form.data.permissions.includes(id));
            return /* @__PURE__ */ jsxs("div", { className: "border border-theme rounded-xl p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-medium text-theme-primary capitalize", children: group }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => toggleGroup(group),
                    className: "text-sm text-primary-600 hover:text-primary-700",
                    children: allSelected ? "Deselect all" : "Select all"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2", children: groupPermissions.map((permission) => /* @__PURE__ */ jsxs(
                "label",
                {
                  className: `flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${form.data.permissions.includes(permission.id) ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800" : "bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: form.data.permissions.includes(permission.id),
                        onChange: () => togglePermission(permission.id),
                        className: "w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-theme-primary truncate", children: permission.display_name }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted font-mono truncate", children: permission.name })
                    ] })
                  ]
                },
                permission.id
              )) })
            ] }, group);
          }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3", children: [
          /* @__PURE__ */ jsx(Link, { href: "/settings/roles", className: "btn btn-outline", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: form.processing, className: "btn btn-primary", children: form.processing ? "Saving..." : isEdit ? "Update Role" : "Create Role" })
        ] })
      ] })
    ] })
  ] });
}
export {
  RoleForm as default
};
