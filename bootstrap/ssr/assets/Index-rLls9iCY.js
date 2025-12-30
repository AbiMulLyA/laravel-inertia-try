import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout, T as Table } from "./AppLayout-ClUKwJTp.js";
import { Head, router, Link } from "@inertiajs/react";
import { Plus, ClipboardList, Clock, CheckCircle2, Hourglass, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import "react";
import { S as StatsCard } from "./StatsCard-DQVB_KgP.js";
import { P as PageHeader, C as Card } from "./PageHeader-DAtmv7HV.js";
import { P as Pagination } from "./Pagination-0C2komkt.js";
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
        return "bg-primary-50 text-primary-700 border border-primary-200";
      case "completed":
        return "bg-secondary-50 text-secondary-700 border border-secondary-200";
      case "pending":
        return "bg-gray-100 text-gray-600 border border-gray-200";
      case "on_hold":
        return "bg-accent-50 text-accent-700 border border-accent-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border border-red-200";
      case "medium":
        return "bg-accent-50 text-accent-700 border border-accent-200";
      case "low":
        return "bg-secondary-50 text-secondary-700 border border-secondary-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };
  const getProgressColor = (progress) => {
    if (progress >= 80) return "from-secondary-400 to-secondary-600";
    if (progress >= 50) return "from-primary-400 to-primary-600";
    if (progress >= 25) return "from-accent-400 to-accent-600";
    return "from-gray-300 to-gray-400";
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Tasks" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Tasks",
          subtitle: "Manage tasks and track progress",
          action: {
            label: "Add Task",
            href: "/tasks/create",
            icon: Plus
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx("div", { onClick: () => router.get("/tasks", {}), children: /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Total Tasks",
            value: summary.total,
            icon: ClipboardList,
            color: "cyan"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { onClick: () => handleFilterChange("status", "in_progress"), children: /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "In Progress",
            value: summary.in_progress,
            icon: Clock,
            color: "primary"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { onClick: () => handleFilterChange("status", "completed"), children: /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Completed",
            value: summary.completed,
            icon: CheckCircle2,
            color: "secondary"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { onClick: () => handleFilterChange("status", "pending"), children: /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Pending",
            value: summary.pending,
            icon: Hourglass,
            color: "secondary"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(Card, { padding: "sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsx("form", { onSubmit: handleSearch, className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "search",
              defaultValue: filters.search || "",
              placeholder: "Search tasks...",
              className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
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
              className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm",
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
              className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm",
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
              className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "All Priority" }),
                Object.entries(priorities).map(([key, label]) => /* @__PURE__ */ jsx("option", { value: key, children: label }, key))
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(Card, { padding: "none", className: "overflow-hidden", children: [
        /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
            /* @__PURE__ */ jsx(Table.Th, { children: "Task" }),
            /* @__PURE__ */ jsx(Table.Th, { children: "Project" }),
            /* @__PURE__ */ jsx(Table.Th, { children: "Target" }),
            /* @__PURE__ */ jsx(Table.Th, { children: "Progress" }),
            /* @__PURE__ */ jsx(Table.Th, { children: "Priority" }),
            /* @__PURE__ */ jsx(Table.Th, { children: "Status" }),
            /* @__PURE__ */ jsx(Table.Th, { align: "right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx(Table.Tbody, { children: tasks.data.map((item) => /* @__PURE__ */ jsxs(Table.Tr, { children: [
            /* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: item.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: item.code })
            ] }) }),
            /* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30", children: item.project?.category?.code || "-" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: item.project?.name || "-" })
            ] }) }),
            /* @__PURE__ */ jsxs(Table.Td, { children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: [
                item.achieved,
                "/",
                item.target,
                " ",
                item.unit
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: formatCurrency(item.budget) })
            ] }),
            /* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsxs("div", { className: "w-28", children: [
              /* @__PURE__ */ jsx("div", { className: "flex justify-between text-xs mb-1", children: /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-700 dark:text-gray-300", children: [
                item.progress,
                "%"
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-full rounded-full bg-gradient-to-r ${getProgressColor(item.progress)}`,
                  style: { width: `${item.progress}%` }
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`, children: item.priority_label }) }),
            /* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`, children: item.status_label }) }),
            /* @__PURE__ */ jsx(Table.Td, { align: "right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/tasks/${item.id}`,
                  className: "p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded-lg transition-colors",
                  children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/tasks/${item.id}/edit`,
                  className: "p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded-lg transition-colors",
                  children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(item.id, item.name),
                  className: "p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] }) })
          ] }, item.id)) })
        ] }),
        tasks.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(ClipboardList, { className: "w-8 h-8 text-gray-400" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "No tasks yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-6", children: "Get started by adding your first task" }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/tasks/create",
              className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                "Add Task"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Pagination,
          {
            links: tasks.links,
            from: (tasks.current_page - 1) * tasks.per_page + 1,
            to: Math.min(tasks.current_page * tasks.per_page, tasks.total),
            total: tasks.total
          }
        )
      ] })
    ] })
  ] });
}
export {
  TasksIndex as default
};
