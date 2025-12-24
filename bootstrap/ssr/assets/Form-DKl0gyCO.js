import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-CbOP_oBK.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import "react";
function CategoryForm({ category }) {
  const isEdit = !!category;
  const { data, setData, post, put, processing, errors } = useForm({
    code: category?.code ?? "",
    name: category?.name ?? "",
    description: category?.description ?? "",
    is_active: category?.is_active ?? true
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      put(`/categories/${category.id}`);
    } else {
      post("/categories");
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Category" : "Add Category" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/categories",
            className: "inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Back to Categories"
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isEdit ? "Edit Category" : "Add New Category" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: isEdit ? "Update category information" : "Fill in the form to add a new category" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white rounded-xl border p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Code ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.code,
                onChange: (e) => setData("code", e.target.value.toUpperCase()),
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.code ? "border-red-500" : "border-gray-300"}`,
                placeholder: "e.g., DEV",
                maxLength: 20
              }
            ),
            errors.code && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Name ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.name ? "border-red-500" : "border-gray-300"}`,
                placeholder: "Category name"
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.description,
              onChange: (e) => setData("description", e.target.value),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",
              placeholder: "Optional description..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: "is_active",
              checked: data.is_active,
              onChange: (e) => setData("is_active", e.target.checked),
              className: "w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "is_active", className: "text-sm text-gray-700", children: "Active" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/categories",
              className: "px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50",
              children: [
                processing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                isEdit ? "Save Changes" : "Add Category"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  CategoryForm as default
};
