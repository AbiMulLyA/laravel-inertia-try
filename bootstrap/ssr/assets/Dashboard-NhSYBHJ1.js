import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-CbOP_oBK.js";
import { Head, router } from "@inertiajs/react";
import { Layers, FolderKanban, ClipboardList, ArrowUpRight, ArrowDownRight } from "lucide-react";
import "react";
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}
function Dashboard({
  overview,
  statisticsCategory,
  tasksByPriority,
  recentActivities,
  year,
  yearOptions
}) {
  const spentPercentage = overview.total_budget > 0 ? (overview.total_spent / overview.total_budget * 100).toFixed(1) : 0;
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Dashboard" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Application overview and statistics" })
        ] }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: year,
            onChange: (e) => router.get("/dashboard", { year: e.target.value }),
            className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            children: yearOptions.map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
              "Year ",
              y
            ] }, y))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx(
          StatCard,
          {
            title: "Categories",
            value: overview.total_categories,
            icon: Layers,
            color: "blue"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            title: "Projects",
            value: overview.total_projects,
            icon: FolderKanban,
            color: "green"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            title: "Total Tasks",
            value: overview.total_tasks,
            icon: ClipboardList,
            color: "purple"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            title: "Completed",
            value: overview.tasks_completed,
            icon: ClipboardList,
            color: "orange"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Budget Overview" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Total Budget" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(overview.total_budget) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Spent" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-primary-600", children: formatCurrency(overview.total_spent) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "Progress" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
                spentPercentage,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-primary-500 rounded-full transition-all duration-500",
                style: { width: `${Math.min(Number(spentPercentage), 100)}%` }
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Task Status" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-blue-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "In Progress" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: overview.tasks_in_progress })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Completed" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: overview.tasks_completed })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-gray-300 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Other" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: overview.total_tasks - overview.tasks_in_progress - overview.tasks_completed })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "p-6 border-b", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Statistics by Category" }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Category" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Projects" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Budget" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Spent" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Progress" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: statisticsCategory.map((category) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary-600", children: category.code }) }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900", children: category.name })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-gray-600", children: category.total_projects }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-gray-600", children: formatCurrency(category.total_budget) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-gray-600", children: formatCurrency(category.total_spent) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-2 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full bg-primary-500 rounded-full",
                  style: { width: `${category.spent_percentage}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600 w-12 text-right", children: [
                category.spent_percentage,
                "%"
              ] })
            ] }) })
          ] }, category.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Tasks by Priority" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: tasksByPriority.slice(0, 6).map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: item.priority_label }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: formatNumber(item.total) })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Activities" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: recentActivities.slice(0, 5).map((activity) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx("div", { className: `
                                        w-2 h-2 rounded-full
                                        ${activity.status === "completed" ? "bg-green-500" : ""}
                                        ${activity.status === "in_progress" ? "bg-blue-500" : ""}
                                        ${activity.status === "pending" ? "bg-gray-400" : ""}
                                        ${activity.status === "on_hold" ? "bg-yellow-500" : ""}
                                    ` }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: activity.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: activity.project?.category?.name })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
              activity.progress,
              "%"
            ] })
          ] }, activity.id)) })
        ] })
      ] })
    ] })
  ] });
}
function StatCard({ title, value, icon: Icon, color, trend }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600"
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6" }) }),
      trend !== void 0 && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1 text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`, children: [
        trend >= 0 ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "w-4 h-4" }),
        Math.abs(trend),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: value }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: title })
    ] })
  ] });
}
export {
  Dashboard as default
};
