import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-CbOP_oBK.js";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, ClipboardList, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import "react";
function formatCurrency(value) {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value}`;
}
function TasksIndex({
  tasks = { data: [], current_page: 1, last_page: 1, per_page: 20, total: 0, links: [] },
  projects = [],
  filters = { project_id: null, status: null, priority: null, search: null },
  summary = { total: 0, in_progress: 0, completed: 0, pending: 0 },
  statuses = {},
  priorities = {}
}) {
  const handleDelete = (id, name) => {
    if (confirm(`Delete task "${name}"?`)) {
      router.delete(`/tasks/${id}`);
    }
  };
  const handleFilterChange = (key, value) => {
    router.get("/tasks", { ...filters, [key]: value }, { preserveState: true });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleFilterChange("search", formData.get("search"));
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
      case "on_hold":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-400";
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Tasks" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Tasks" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Manage tasks and track progress" })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/tasks/create",
            className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              "Add Task"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(ClipboardList, { className: "w-5 h-5 text-purple-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: summary.total }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Total Tasks" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white rounded-xl border p-4 cursor-pointer hover:bg-blue-50 transition-colors",
            onClick: () => handleFilterChange("status", "in_progress"),
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-600", children: summary.in_progress }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "In Progress" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white rounded-xl border p-4 cursor-pointer hover:bg-green-50 transition-colors",
            onClick: () => handleFilterChange("status", "completed"),
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600", children: summary.completed }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Completed" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white rounded-xl border p-4 cursor-pointer hover:bg-gray-50 transition-colors",
            onClick: () => handleFilterChange("status", "pending"),
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-600", children: summary.pending }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Pending" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsx("form", { onSubmit: handleSearch, className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "search",
              defaultValue: filters.search || "",
              placeholder: "Search tasks...",
              className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4 text-gray-400" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filters.project_id || "",
              onChange: (e) => handleFilterChange("project_id", e.target.value),
              className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "All Projects" }),
                projects.map((p) => /* @__PURE__ */ jsx("option", { value: p.id, children: p.name }, p.id))
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filters.status || "",
              onChange: (e) => handleFilterChange("status", e.target.value),
              className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "All Status" }),
                Object.entries(statuses).map(([key, label]) => /* @__PURE__ */ jsx("option", { value: key, children: label }, key))
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filters.priority || "",
              onChange: (e) => handleFilterChange("priority", e.target.value),
              className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "All Priority" }),
                Object.entries(priorities).map(([key, label]) => /* @__PURE__ */ jsx("option", { value: key, children: label }, key))
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Task" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Project" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Target" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Progress" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Priority" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: tasks.data.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900", children: item.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: item.code })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-700", children: item.project?.category?.code || "-" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: item.project?.name || "-" })
            ] }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-900", children: [
                item.achieved,
                "/",
                item.target,
                " ",
                item.unit
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: formatCurrency(item.budget) })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "w-24", children: [
              /* @__PURE__ */ jsx("div", { className: "flex justify-between text-xs mb-1", children: /* @__PURE__ */ jsxs("span", { children: [
                item.progress,
                "%"
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-100 rounded-full h-2", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-2 rounded-full ${getProgressColor(item.progress)}`,
                  style: { width: `${item.progress}%` }
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`, children: item.priority_label }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`, children: item.status_label }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/tasks/${item.id}`,
                  className: "p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg",
                  children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/tasks/${item.id}/edit`,
                  className: "p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg",
                  children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(item.id, item.name),
                  className: "p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] }) })
          ] }, item.id)) })
        ] }) }),
        tasks.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsx(ClipboardList, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No tasks yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-4", children: "Get started by adding your first task" }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/tasks/create",
              className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                "Add Task"
              ]
            }
          )
        ] }),
        tasks.last_page > 1 && /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
            "Showing ",
            (tasks.current_page - 1) * tasks.per_page + 1,
            " - ",
            Math.min(tasks.current_page * tasks.per_page, tasks.total),
            " of ",
            tasks.total
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: tasks.links.map((link, index) => /* @__PURE__ */ jsx(
            Link,
            {
              href: link.url || "#",
              className: `px-3 py-1 rounded text-sm ${link.active ? "bg-primary-600 text-white" : link.url ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed"}`,
              dangerouslySetInnerHTML: { __html: link.label }
            },
            index
          )) })
        ] })
      ] })
    ] })
  ] });
}
export {
  TasksIndex as default
};
