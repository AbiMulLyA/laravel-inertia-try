import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout, T as Table } from "./AppLayout-ClUKwJTp.js";
import { Head, router } from "@inertiajs/react";
import { Layers, FolderKanban, ClipboardList, CheckCircle2 } from "lucide-react";
import "react";
import { S as StatsCard } from "./StatsCard-DQVB_KgP.js";
import { P as PageHeader, C as Card, a as CardHeader } from "./PageHeader-DAtmv7HV.js";
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
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Dashboard",
          subtitle: "Application overview and statistics",
          children: /* @__PURE__ */ jsx(
            "select",
            {
              value: year,
              onChange: (e) => router.get("/dashboard", { year: e.target.value }),
              className: "px-4 py-2 bg-white dark:bg-[#1a2744] border border-gray-300 dark:border-[#1e3a5f] rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              children: yearOptions.map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
                "Year ",
                y
              ] }, y))
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Categories",
            value: overview.total_categories,
            icon: Layers,
            color: "primary"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Projects",
            value: overview.total_projects,
            icon: FolderKanban,
            color: "secondary"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Total Tasks",
            value: overview.total_tasks,
            icon: ClipboardList,
            color: "accent"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Completed",
            value: overview.tasks_completed,
            icon: CheckCircle2,
            color: "cyan"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs(Card, { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsx(CardHeader, { title: "Budget Overview" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Total Budget" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: formatCurrency(overview.total_budget) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Spent" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-primary-600 dark:text-primary-400", children: formatCurrency(overview.total_spent) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Progress" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: [
                spentPercentage,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700 ease-out",
                style: { width: `${Math.min(Number(spentPercentage), 100)}%` }
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { title: "Task Status" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-primary-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "In Progress" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: overview.tasks_in_progress })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-secondary-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Completed" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: overview.tasks_completed })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Other" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: overview.total_tasks - overview.tasks_in_progress - overview.tasks_completed })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { padding: "none", children: [
        /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-gray-100 dark:border-[#1e3a5f]", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Statistics by Category" }) }),
        /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
            /* @__PURE__ */ jsx(Table.Th, { children: "Category" }),
            /* @__PURE__ */ jsx(Table.Th, { align: "right", children: "Projects" }),
            /* @__PURE__ */ jsx(Table.Th, { align: "right", children: "Budget" }),
            /* @__PURE__ */ jsx(Table.Th, { align: "right", children: "Spent" }),
            /* @__PURE__ */ jsx(Table.Th, { align: "right", children: "Progress" })
          ] }) }),
          /* @__PURE__ */ jsx(Table.Tbody, { children: statisticsCategory.map((category) => /* @__PURE__ */ jsxs(Table.Tr, { children: [
            /* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-500/30 dark:to-primary-500/10 rounded-lg flex items-center justify-center border border-primary-200 dark:border-primary-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary-700 dark:text-primary-400", children: category.code }) }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: category.name })
            ] }) }),
            /* @__PURE__ */ jsx(Table.Td, { align: "right", children: /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-600 dark:text-gray-400", children: category.total_projects }) }),
            /* @__PURE__ */ jsx(Table.Td, { align: "right", children: /* @__PURE__ */ jsx("div", { className: "text-gray-600 dark:text-gray-400", children: formatCurrency(category.total_budget) }) }),
            /* @__PURE__ */ jsx(Table.Td, { align: "right", children: /* @__PURE__ */ jsx("div", { className: "text-gray-600 dark:text-gray-400", children: formatCurrency(category.total_spent) }) }),
            /* @__PURE__ */ jsx(Table.Td, { align: "right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-20 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full",
                  style: { width: `${category.spent_percentage}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right", children: [
                category.spent_percentage,
                "%"
              ] })
            ] }) })
          ] }, category.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { title: "Tasks by Priority" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: tasksByPriority.slice(0, 6).map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-50 dark:border-[#1e3a5f] last:border-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: item.priority_label }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-[#1a2744] px-3 py-1 rounded-full", children: formatNumber(item.total) })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { title: "Recent Activities" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: recentActivities.slice(0, 5).map((activity) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a2744] transition-colors", children: [
            /* @__PURE__ */ jsx("div", { className: `
                                        w-2.5 h-2.5 rounded-full flex-shrink-0
                                        ${activity.status === "completed" ? "bg-secondary-500" : ""}
                                        ${activity.status === "in_progress" ? "bg-primary-500" : ""}
                                        ${activity.status === "pending" ? "bg-gray-400" : ""}
                                        ${activity.status === "on_hold" ? "bg-accent-500" : ""}
                                    ` }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white truncate", children: activity.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: activity.project?.category?.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full bg-primary-500 rounded-full",
                  style: { width: `${activity.progress}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 w-8", children: [
                activity.progress,
                "%"
              ] })
            ] })
          ] }, activity.id)) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Dashboard as default
};
