import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-ClUKwJTp.js";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import "react";
import { P as PageHeader, C as Card } from "./PageHeader-DAtmv7HV.js";
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
function CategoriesIndex({ categories = [] }) {
  const handleDelete = (id, name) => {
    if (confirm(`Delete category "${name}"?`)) {
      router.delete(`/categories/${id}`);
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Categories" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Categories",
          subtitle: "Manage master data categories",
          action: {
            label: "Add Category",
            href: "/categories/create",
            icon: Plus
          }
        }
      ),
      /* @__PURE__ */ jsxs(Card, { padding: "none", className: "overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 border-b border-gray-100", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Category" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Description" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Projects" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Budget" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: categories.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center border border-primary-200", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary-700", children: item.code }) }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900", children: item.name })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-500 max-w-xs truncate", children: item.description || "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-gray-600 font-medium", children: item.total_projects }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-gray-600", children: formatCurrency(item.total_budget) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.is_active ? "bg-secondary-50 text-secondary-700 border border-secondary-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`, children: item.is_active ? "Active" : "Inactive" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/categories/${item.id}/edit`,
                  className: "p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors",
                  children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(item.id, item.name),
                  className: "p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] }) })
          ] }, item.id)) })
        ] }) }),
        categories.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Layers, { className: "w-8 h-8 text-gray-400" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No categories yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-6", children: "Get started by adding your first category" }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/categories/create",
              className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                "Add Category"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  CategoriesIndex as default
};
