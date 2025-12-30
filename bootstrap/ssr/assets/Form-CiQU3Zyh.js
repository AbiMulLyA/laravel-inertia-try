import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-ClUKwJTp.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Key } from "lucide-react";
import { useState } from "react";
import { P as PageHeader, C as Card } from "./PageHeader-DAtmv7HV.js";
function PermissionForm({ permission, groups, isEdit }) {
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const form = useForm({
    name: permission?.name || "",
    display_name: permission?.display_name || "",
    description: permission?.description || "",
    group: permission?.group || groups[0] || "general"
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNewGroup && newGroup) {
      form.setData("group", newGroup.toLowerCase());
    }
    if (isEdit && permission?.id) {
      form.put(`/settings/permissions/${permission.id}`);
    } else {
      form.post("/settings/permissions");
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Permission" : "Add Permission" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/settings/permissions",
            className: "p-2 text-theme-muted hover:text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors",
            children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          PageHeader,
          {
            title: isEdit ? "Edit Permission" : "Add Permission",
            subtitle: isEdit ? `Editing ${permission?.display_name}` : "Create a new permission"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Key, { className: "w-5 h-5 text-primary-600 dark:text-primary-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-theme-primary", children: "Permission Details" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary", children: "Define the permission identifier and settings" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "Name (identifier)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.data.name,
                onChange: (e) => form.setData("name", e.target.value.toLowerCase().replace(/\s/g, ".")),
                className: "form-input font-mono",
                placeholder: "users.create"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted mt-1", children: "Use dots to separate namespace (e.g., users.create, projects.delete)" }),
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
                placeholder: "Create Users"
              }
            ),
            form.errors.display_name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: form.errors.display_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "Description" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: form.data.description,
                onChange: (e) => form.setData("description", e.target.value),
                className: "form-input",
                rows: 2,
                placeholder: "Allows creating new user accounts"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "Group" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    checked: !isNewGroup,
                    onChange: () => setIsNewGroup(false),
                    className: "text-primary-600"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-theme-secondary", children: "Existing group" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    checked: isNewGroup,
                    onChange: () => setIsNewGroup(true),
                    className: "text-primary-600"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-theme-secondary", children: "New group" })
              ] })
            ] }),
            isNewGroup ? /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: newGroup,
                onChange: (e) => setNewGroup(e.target.value),
                className: "form-input",
                placeholder: "New group name"
              }
            ) : /* @__PURE__ */ jsxs(
              "select",
              {
                value: form.data.group,
                onChange: (e) => form.setData("group", e.target.value),
                className: "form-input",
                children: [
                  groups.length === 0 && /* @__PURE__ */ jsx("option", { value: "general", children: "general" }),
                  groups.map((group) => /* @__PURE__ */ jsx("option", { value: group, children: group }, group))
                ]
              }
            ),
            form.errors.group && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: form.errors.group })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 mt-6 pt-6 border-t border-theme", children: [
          /* @__PURE__ */ jsx(Link, { href: "/settings/permissions", className: "btn btn-outline", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: form.processing, className: "btn btn-primary", children: form.processing ? "Saving..." : isEdit ? "Update Permission" : "Create Permission" })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  PermissionForm as default
};
